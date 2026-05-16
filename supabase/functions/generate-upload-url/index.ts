import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { eventId, participantId, fileSizeBytes, mimeType, fileNameHint } = await req.json();

    if (!eventId || !participantId || !fileNameHint) {
      throw new Error("Missing required parameters");
    }

    // Optionally: Check if participant exists and has shots left, or rate limits.

    const path = `${eventId}/${participantId}/${crypto.randomUUID()}_${fileNameHint}`;

    const { data, error } = await supabase.storage
      .from('photos')
      .createSignedUploadUrl(path);

    if (error) throw error;

    return new Response(JSON.stringify({ signedUrl: data.signedUrl, path: data.path }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
