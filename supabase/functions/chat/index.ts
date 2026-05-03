import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const botPersona = `
Ти — професійний асистент SkyLink.
Твоя задача — допомагати з авіаквитками, готелями та профілем.

БАЗА ЗНАНЬ:
* Київ - Париж: від 4 200 грн.
* Київ - Барселона: від 5 600 грн.
* Львів - Дубай: від 8 900 грн.
* Варшава - Токіо: від 12 800 грн.
* Львів - Нью-Йорк: від 16 700 грн.
* Одеса - Гонконг: від 19 500 грн.

ГОТЕЛІ:
* Нью-Йорк: The Plaza (5800 грн) та Baccarat (8200 грн).
* Токіо: Aman (6200 грн) та Park Hyatt (5800 грн).
* Париж: Le Meurice (4500 грн) та Hotel Ritz (7100 грн).

ПРАВИЛА:
1. Ніколи не вигадуй ціни.
2. Відповідай коротко українською.
`;

serve(async (req) => {
  // Обробка CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) throw new Error("Порожній масив повідомлень");

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY не знайдено");

    // Формуємо масив contents для чистого REST API Google
    const contents = [];

    // 1. Підкидаємо персону
    contents.push({ role: "user", parts: [{ text: botPersona }] });
    contents.push({ role: "model", parts: [{ text: "Зрозумів. Я готовий допомагати!" }] });

    // 2. Додаємо історію
    const historyData = messages.slice(0, -1);
    historyData.forEach((msg: any) => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    });

    // 3. Додаємо поточне питання користувача
    const lastMessage = messages[messages.length - 1].content;
    contents.push({ role: "user", parts: [{ text: lastMessage }] });

    // ПРЯМИЙ ЗАПИТ ДО GOOGLE (БЕЗ SDK)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const googleResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });

    const data = await googleResponse.json();

    // Перехоплюємо помилки від Google напряму
    if (!googleResponse.ok) {
      console.error("Google API Error:", data.error);
      throw new Error(`Google API: ${data.error?.message || "Невідома помилка"}`);
    }

    // Витягуємо текст відповіді
    const reply = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});