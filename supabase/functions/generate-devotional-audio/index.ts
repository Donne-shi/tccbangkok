import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { devotionalId, content, title } = await req.json();
    if (!devotionalId || !content) {
      return new Response(JSON.stringify({ error: "Missing devotionalId or content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Use Lovable AI to generate a spoken-word script, then use TTS-like approach
    // For now, we'll use Lovable AI with a text-to-speech prompt approach
    // Generate a clean reading version of the content
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "你是一个教会灵修朗读助手。请将以下灵修内容整理成适合朗读的文字版本，去除不必要的格式标记，保持内容完整，语言流畅自然。在开头加上标题介绍。"
          },
          {
            role: "user",
            content: `标题：${title}\n\n内容：${content}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "请求频率过高，请稍后再试" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI额度不足，请充值" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    const processedText = aiData.choices?.[0]?.message?.content || content;

    // Store the processed text as a simple text-based audio placeholder
    // In production, integrate a proper TTS service
    // For now, we use the browser's built-in speech synthesis on the client side
    // and store the processed script

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store processed text and mark for client-side TTS
    const { error: updateError } = await supabaseAdmin
      .from("devotional_posts")
      .update({ audio_url: `tts:${processedText.slice(0, 5000)}` })
      .eq("id", devotionalId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      success: true, 
      processedText: processedText.slice(0, 500) + "...",
      message: "音频文字已生成，将使用浏览器语音合成播放"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
