const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenant_id, date } = await req.json();

    if (!tenant_id || !date) {
      return new Response(JSON.stringify({ error: 'tenant_id and date are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = `https://api.playtomic.io/v1/availability?sport_id=PADEL&tenant_id=${encodeURIComponent(tenant_id)}&local_start_min=${date}T00%3A00%3A00&local_start_max=${date}T23%3A59%3A59`;

    console.log('Fetching URL:', url);

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.text();
    console.log('Response status:', response.status, 'Body length:', data.length, 'Body preview:', data.substring(0, 500));

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
