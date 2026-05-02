import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY")}`,
        "HTTP-Referer": "https://skylink.app",
        "X-OpenRouter-Title": "SkyLink",
      },
      body: JSON.stringify({
        model: "nousresearch/hermes-3-llama-3.1-405b:free",
        messages: [
          {
            role: "system",
            content: "Ти — помічник авіасервісу SkyLink. Відповідай українською мовою. Допомагай з питаннями про рейси, бронювання квитків, багаж, реєстрацію та подорожі. Будь ввічливим і лаконічним."
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data));

    if (data.error) {
      throw new Error(`OpenRouter error: ${data.error.message}`);
    }

    const reply = data.choices?.[0]?.message?.content ?? "Вибачте, не вдалося отримати відповідь.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});







/----------------------------/ БАЗА ДАНИХ /----------------------------/


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'ТВОЇ_URL';
const supabaseKey = 'ТВОЇ_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);