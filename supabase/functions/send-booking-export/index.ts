import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Using Resend REST API directly instead of npm package

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper to format date as DD.MM.YYYY
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Get start and end of next week (Monday to Sunday)
function getNextWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  
  // Calculate days until next Monday
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilNextMonday);
  nextMonday.setHours(0, 0, 0, 0);
  
  const nextSunday = new Date(nextMonday);
  nextSunday.setDate(nextMonday.getDate() + 6);
  
  const formatISO = (d: Date) => d.toISOString().split('T')[0];
  
  return {
    start: formatISO(nextMonday),
    end: formatISO(nextSunday),
  };
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
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get next week's date range
    const { start, end } = getNextWeekRange();
    console.log(`Fetching bookings from ${start} to ${end}`);

    // Fetch bookings for next week
    const { data: bookings, error: bookingsError } = await supabase
      .from("court_bookings")
      .select(`
        *,
        court_slot:court_slots(
          slot_date,
          start_time,
          end_time,
          court_name,
          venue:padel_venues(name)
        ),
        match:matches(
          team_a:teams!matches_team_a_id_fkey(name, captain_name, captain_email, player2_name, player2_email),
          team_b:teams!matches_team_b_id_fkey(name, captain_name, captain_email, player2_name, player2_email)
        )
      `)
      .gte("court_slot.slot_date", start)
      .lte("court_slot.slot_date", end)
      .order("booked_at", { ascending: true });

    if (bookingsError) {
      throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
    }

    // Filter valid bookings (those with court_slot)
    const validBookings = (bookings || []).filter((b: any) => b.court_slot);

    console.log(`Found ${validBookings.length} bookings for next week`);

    // Create CSV content
    const headers = [
      "Datum",
      "Platz",
      "Uhrzeit",
      "Verein",
      "Team A",
      "Captain A",
      "Email Captain A",
      "Spieler 2 A",
      "Email Spieler 2 A",
      "Team B",
      "Captain B",
      "Email Captain B",
      "Spieler 2 B",
      "Email Spieler 2 B",
    ];

    const rows = validBookings.map((booking: any) => {
      const slot = booking.court_slot;
      const match = booking.match;
      const teamA = match?.team_a;
      const teamB = match?.team_b;

      return [
        formatDate(slot.slot_date),
        slot.court_name,
        `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
        slot.venue?.name || "",
        teamA?.name || "",
        teamA?.captain_name || "",
        teamA?.captain_email || "",
        teamA?.player2_name || "",
        teamA?.player2_email || "",
        teamB?.name || "",
        teamB?.captain_name || "",
        teamB?.captain_email || "",
        teamB?.player2_name || "",
        teamB?.player2_email || "",
      ];
    });

    // Create CSV string with BOM for Excel
    const BOM = "\uFEFF";
    const csvContent = BOM + [
      headers.join(";"),
      ...rows.map((row: string[]) => row.map((cell) => `"${cell}"`).join(";")),
    ].join("\n");

    // Convert to base64 for email attachment
    const csvBase64 = btoa(unescape(encodeURIComponent(csvContent)));

    // Format week range for email
    const weekLabel = `${formatDate(start)} - ${formatDate(end)}`;
    const filename = `platzbuchungen_${start}_${end}.csv`;

    // Send email via Resend REST API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Padel Liga <noreply@berlin-padel-league.lovable.app>",
        to: settings.recipient_emails,
        subject: `Platzbuchungen ${weekLabel}`,
        html: `
          <h1>Platzbuchungen für die Woche</h1>
          <p><strong>${weekLabel}</strong></p>
          <p>Im Anhang finden Sie die CSV-Datei mit ${validBookings.length} Buchungen.</p>
          ${validBookings.length === 0 ? "<p><em>Keine Buchungen für diese Woche vorhanden.</em></p>" : ""}
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
      throw new Error(`Resend API error: ${errorData}`);
    }

    const emailResult = await emailResponse.json();

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Export sent to ${settings.recipient_emails.length} recipients`,
        bookingsCount: validBookings.length,
        weekRange: weekLabel,
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

serve(handler);
