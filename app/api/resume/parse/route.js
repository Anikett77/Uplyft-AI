import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PdfReader } = require("pdfreader");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ── Extract text from PDF buffer using pdfreader ──
function extractTextFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const lines = [];
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        // end of file
        resolve(lines.join(" "));
      } else if (item.text) {
        lines.push(item.text);
      }
    });
  });
}

export async function POST(request) {
  try {
    // ── 1. Get PDF file ──
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // ── 2. Extract text ──
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await extractTextFromBuffer(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { message: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    // ── 3. Send to OpenRouter AI ──
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a resume parser. Extract information from the resume text and return ONLY a valid JSON object with these exact fields:
{
  "fullName": "string",
  "college": "string",
  "degree": "string (e.g. B.Tech, B.Sc, MCA)",
  "branch": "string (e.g. Computer Science, ECE)",
  "cgpa": "string (just the number e.g. 8.5)",
  "targetRole": "string (infer from skills/experience)",
  "experience": "string (summary of experience or Fresher)",
  "skills": ["array", "of", "skills"],
  "interests": ["array", "of", "interests"]
}
Return ONLY the JSON. No explanation, no markdown, no backticks.`,
        },
        {
          role: "user",
          content: `Parse this resume:\n\n${resumeText}`,
        },
      ],
      temperature: 0.1,
    });

    // ── 4. Parse AI response ──
    const rawResponse = completion.choices[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      const cleaned = rawResponse.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json({
      message: "Resume parsed successfully",
      data: parsed,
    });

  } catch (error) {
    console.error("Resume parse error:", error.message);
    return NextResponse.json(
      { message: "Failed to parse resume: " + error.message },
      { status: 500 }
    );
  }
}