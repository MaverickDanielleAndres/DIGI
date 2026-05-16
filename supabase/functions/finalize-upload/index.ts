// @ts-nocheck
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

    const { eventId, participantId, storagePath, cameraStyle, width, height, fileSizeBytes, latitude, longitude, capturedAt } = await req.json();

    if (!eventId || !participantId || !storagePath) {
      throw new Error("Missing required parameters");
    }

    // Insert into photos table
    const { data: photo, error: insertError } = await supabase
      .from('photos')
      .insert({
        event_id: eventId,
        uploader_id: participantId,
        storage_path: storagePath,
        camera_style_used: cameraStyle,
        width,
        height,
        file_size_bytes: fileSizeBytes,
        latitude,
        longitude,
        captured_at: capturedAt,
        upload_status: 'complete',
        is_revealed: false,
        is_approved: false
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    // Trigger process-photo webhooks asynchronously via Database triggers, 
    // or we could do something else here.

    return new Response(JSON.stringify({ photoId: photo.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
