import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, type, resumeData, history, userAnswer, currentQuestion } = body;

    const questionNumber = (history?.length || 0) + 1;

    // ── Resume context ──
    const resumeContext = resumeData
      ? `Candidate profile:
- Name: ${resumeData.fullName || "Candidate"}
- Role target: ${resumeData.targetRole || "Software Engineer"}
- Experience: ${resumeData.experience || "Fresher"}
- Skills: ${(resumeData.skills || []).join(", ")}
- Degree: ${resumeData.degree || ""} ${resumeData.branch || ""}
- College: ${resumeData.college || ""}`
      : "Generic candidate.";

    const typeDescriptions = {
      Behavioral: "behavioral questions about teamwork, leadership, and experiences.",
      Technical: "technical questions about coding, DSA, and problem-solving.",
      "Case Study": "case study questions testing analytical thinking.",
    };

    // ════════════════════════════════════════
    // ✅ QUESTION (MCQ TEXT — NO JSON)
    // ════════════════════════════════════════
    if (action === "question") {
      const messages = [
        {
          role: "system",
          content: `You are an expert ${type} interviewer.
${resumeContext}

Ask ${typeDescriptions[type] || typeDescriptions.Technical}

Rules:
- Ask ONE MCQ
- Question ${questionNumber} of 7
- 4 options (A-D)
- Only ONE correct

Format:
Question: ...
A. ...
B. ...
C. ...
D. ...

Correct Answer: A/B/C/D
Explanation: short

No extra text.`,
        },
        ...(history || []).flatMap(h => [
          { role: "assistant", content: h.question },
          { role: "user", content: h.answer },
        ]),
        {
          role: "user",
          content: "Next question",
        },
      ];

      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages,
        temperature: 0.7,
      });

      const question = completion.choices[0]?.message?.content?.trim();

      return NextResponse.json({ question, questionNumber });
    }

    // ════════════════════════════════════════
    // ✅ FEEDBACK (PURE JSON — NO MCQ PROMPT)
    // ════════════════════════════════════════
    if (action === "feedback") {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert interviewer.

Return ONLY JSON:
{
  "score": <1-10>,
  "correct": true/false,
  "correctAnswer": "<A/B/C/D>",
  "explanation": "<short explanation>",
  "tip": "<1 improvement tip>"
}`,
          },
          {
            role: "user",
            content: `Question:
${currentQuestion}

User selected: ${userAnswer}

Evaluate if correct.`,
          },
        ],
        temperature: 0.2,
      });

      const raw = completion.choices[0]?.message?.content || "{}";

      let feedback;
      try {
        feedback = JSON.parse(raw);
      } catch {
        feedback = JSON.parse(raw.replace(/```json|```/g, "").trim());
      }

      return NextResponse.json({ feedback });
    }

    // ════════════════════════════════════════
    // ✅ REPORT (PURE JSON)
    // ════════════════════════════════════════
    if (action === "report") {
      const completion = await client.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Generate final report. Return ONLY JSON:

{
  "overallScore": <1-10>,
  "summary": "<short summary>",
  "strengths": ["..."],
  "improvements": ["..."]
}`,
          },
          {
            role: "user",
            content: `Session:
${(history || [])
  .map((h, i) => `Q${i + 1}: ${h.question}\nA: ${h.answer}`)
  .join("\n\n")}`,
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content || "{}";

      let report;
      try {
        report = JSON.parse(raw);
      } catch {
        report = JSON.parse(raw.replace(/```json|```/g, "").trim());
      }

      return NextResponse.json({ report });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("Interview API error:", err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}