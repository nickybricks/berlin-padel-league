import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getNextWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilNextMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);

  const formatISO = (d: Date) => d.toISOString().split("T")[0];
  return { start: formatISO(nextMonday), end: formatISO(nextSunday) };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if auto-export is enabled and get recipients
    const { data: settings, error: settingsError } = await supabase
      .from("booking_export_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError) {
      console.log("No export settings found:", settingsError.message);
      return new Response(
        JSON.stringify({ success: false, message: "No export settings configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!settings.is_active) {
      console.log("Auto-export is disabled");
      return new Response(
        JSON.stringify({ success: false, message: "Auto-export is disabled" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!settings.recipient_emails || settings.recipient_emails.length === 0) {
      console.log("No recipients configured");
      return new Response(
        JSON.stringify({ success: false, message: "No recipients configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, message: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get next week's date range
    const { start, end } = getNextWeekRange();
    console.log(`Fetching bookings from ${start} to ${end}`);

    // Fetch all court slots for next week first, then join bookings
    const { data: slots, error: slotsError } = await supabase
      .from("court_slots")
      .select(`
        id,
        slot_date,
        start_time,
        end_time,
        court_name,
        venue:padel_venues(name)
      `)
      .gte("slot_date", start)
      .lte("slot_date", end)
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (slotsError) {
      throw new Error(`Failed to fetch slots: ${slotsError.message}`);
    }

    // Get slot IDs
    const slotIds = (slots || []).map((s: any) => s.id);

    if (slotIds.length === 0) {
      console.log("No court slots found for next week");
      // Still send an email saying no bookings
      await sendEmail(resendApiKey, settings.recipient_emails, start, end, []);
      return new Response(
        JSON.stringify({ success: true, message: "Export sent (no bookings)", bookingsCount: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch bookings for those slots
    const { data: bookings, error: bookingsError } = await supabase
      .from("court_bookings")
      .select(`
        id,
        court_slot_id,
        match:matches(
          team_a:teams!matches_team_a_id_fkey(name, player1_name, player1_email, player2_name, player2_email),
          team_b:teams!matches_team_b_id_fkey(name, player1_name, player1_email, player2_name, player2_email)
        )
      `)
      .in("court_slot_id", slotIds);

    if (bookingsError) {
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
    }

    // Merge slots and bookings
    const bookingsBySlot = new Map<string, any>();
    (bookings || []).forEach((b: any) => {
      bookingsBySlot.set(b.court_slot_id, b);
    });

    const mergedData = (slots || []).map((slot: any) => {
      const booking = bookingsBySlot.get(slot.id);
      return { slot, booking };
    });

    const bookedSlots = mergedData.filter((d: any) => d.booking);

    console.log(`Found ${bookedSlots.length} bookings for next week (${slots?.length} total slots)`);

    await sendEmail(resendApiKey, settings.recipient_emails, start, end, bookedSlots);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Export sent to ${settings.recipient_emails.length} recipients`,
        bookingsCount: bookedSlots.length,
        weekRange: `${formatDate(start)} - ${formatDate(end)}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-booking-export:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

async function sendEmail(
  resendApiKey: string,
  recipients: string[],
  start: string,
  end: string,
  bookedSlots: any[]
) {
  const headers = [
    "Datum",
    "Platz",
    "Uhrzeit",
    "Verein",
    "Team A",
    "Spieler 1 A",
    "Email Spieler 1 A",
    "Spieler 2 A",
    "Email Spieler 2 A",
    "Team B",
    "Spieler 1 B",
    "Email Spieler 1 B",
    "Spieler 2 B",
    "Email Spieler 2 B",
  ];

  const rows = bookedSlots.map((item: any) => {
    const slot = item.slot;
    const match = item.booking?.match;
    const teamA = match?.team_a;
    const teamB = match?.team_b;

    return [
      formatDate(slot.slot_date),
      slot.court_name,
      `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
      slot.venue?.name || "",
      teamA?.name || "",
      teamA?.player1_name || "",
      teamA?.player1_email || "",
      teamA?.player2_name || "",
      teamA?.player2_email || "",
      teamB?.name || "",
      teamB?.player1_name || "",
      teamB?.player1_email || "",
      teamB?.player2_name || "",
      teamB?.player2_email || "",
    ];
  });

  const BOM = "\uFEFF";
  const csvContent =
    BOM +
    [headers.join(";"), ...rows.map((row: string[]) => row.map((cell) => `"${cell}"`).join(";"))].join("\n");

  const csvBase64 = btoa(unescape(encodeURIComponent(csvContent)));
  const weekLabel = `${formatDate(start)} - ${formatDate(end)}`;
  const filename = `platzbuchungen_${start}_${end}.csv`;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Padel Liga <onboarding@resend.dev>",
      to: recipients,
      subject: `Platzbuchungen ${weekLabel}`,
      html: `
        <h1>Platzbuchungen für die Woche</h1>
        <p><strong>${weekLabel}</strong></p>
        <p>Im Anhang finden Sie die CSV-Datei mit ${bookedSlots.length} Buchung(en).</p>
        ${bookedSlots.length === 0 ? "<p><em>Keine Buchungen für diese Woche vorhanden.</em></p>" : ""}
        <hr>
        <p style="color: #666; font-size: 12px;">
          Diese E-Mail wurde automatisch generiert.
          Der Export erfolgt jeden Freitag nach Buchungsschluss (Donnerstag 23:59 Uhr).
        </p>
      `,
      attachments: [
        {
          filename,
          content: csvBase64,
        },
      ],
    }),
  });

  if (!emailResponse.ok) {
    const errorData = await emailResponse.text();
    throw new Error(`Resend API error (${emailResponse.status}): ${errorData}`);
  }

  const emailResult = await emailResponse.json();
  console.log("Email sent successfully:", emailResult);
}

serve(handler);
