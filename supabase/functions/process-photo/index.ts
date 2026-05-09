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
    const payload = await req.json();
    const photo = payload.record; // This will be the new photo from the webhook

    if (!photo || !photo.storage_path) {
      return new Response(JSON.stringify({ error: "No photo provided" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Get the public URL of the photo to analyze
    const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(photo.storage_path);

    let aiCaption = "A wonderful moment captured on Digi! 📸";
    let aiTags = ["memory", "candid", "event"];

    // 2. Process with OpenAI Vision (if key exists)
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (openAiKey) {
      console.log("Analyzing image with OpenAI Vision API...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Provide a short, emotional, Instagram-style caption for this photo (max 1 sentence) and 3 comma-separated tags." },
                { type: "image_url", image_url: { url: publicUrl } }
              ]
            }
          ],
          max_tokens: 100
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content.split('\n');
        if (content.length > 0) aiCaption = content[0].replace(/"/g, '');
        if (content.length > 1) aiTags = content[1].split(',').map((t: string) => t.trim().toLowerCase());
      } else {
        console.error("OpenAI API Error:", await response.text());
      }
    } else {
      console.log("No OPENAI_API_KEY found. Falling back to default processing.");
    }

    // 3. Update the photo record with the AI results and auto-approve
    const { error: updateError } = await supabase
      .from("photos")
      .update({
        ai_caption: aiCaption,
        ai_tags: aiTags,
        is_approved: true // Moderation Phase 11
      })
      .eq("id", photo.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, aiCaption, aiTags }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing photo:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
