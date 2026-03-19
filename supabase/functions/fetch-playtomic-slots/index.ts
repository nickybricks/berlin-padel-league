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

    const url = `https://api.playtomic.io/v1/availability?sport_id=PADEL&tenant_id=${encodeURIComponent(tenant_id)}&start_min=${date}T00:00:00&start_max=${date}T23:59:59`;

    console.log('Fetching Playtomic URL:', url);

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.text();
    
    console.log('Playtomic response status:', response.status);
    console.log('Playtomic response body preview:', data.substring(0, 300));

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
