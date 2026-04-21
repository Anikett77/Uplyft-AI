import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // ✅ SAME MODEL
        messages: [
          {
            role: "system",
            content:
              "You are an expert AI Career Mentor. Give concise, practical, and actionable advice in a friendly tone.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error("Invalid API response");
    }

    return NextResponse.json({
      reply:
        data.choices?.[0]?.message?.content ||
        "Sorry, no response received.",
    });

  } catch (err) {
    console.error("Mentor API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}