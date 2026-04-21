import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createRequire } from "module";
import { connect } from "@/app/dbConfig/dbConfig";      // adjust to your db util
import ResumeATS from "@/app/models/resumeATS";      // the model from File 3 // or your own auth util

const require = createRequire(import.meta.url);
const { PdfReader } = require("pdfreader");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ── Extract text from PDF buffer ──────────────────────────────────────────
function extractTextFromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const lines = [];
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(lines.join(" "));
      else if (item.text) lines.push(item.text);
    });
  });
}

// ── POST /api/analyze-resume ──────────────────────────────────────────────
export async function POST(request) {
  try {
    // ── 1. Auth (optional but recommended) ──
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id || null;

    // ── 2. Parse form data ──
    const formData   = await request.formData();
    const file       = formData.get("resume");
    const parsedRaw  = formData.get("parsedData");   // JSON string from Step 1

    if (!file) return NextResponse.json({ message: "No file uploaded" }, { status: 400 });

    const parsedData = parsedRaw ? JSON.parse(parsedRaw) : {};

    // ── 3. Extract resume text ──
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const resumeText  = await extractTextFromBuffer(buffer);

    if (!resumeText?.trim()) {
      return NextResponse.json({ message: "Could not extract text from PDF" }, { status: 400 });
    }

    // ── 4. Build AI prompt ──
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyze the resume and return ONLY a valid JSON object with this EXACT structure — no markdown, no backticks, no explanation:

{
  "atsScore": <integer 0-100>,
  "overallSummary": "<2 sentence summary of resume quality>",

  "roleMatch": {
    "score": <integer 0-100>,
    "role": "<inferred target role>",
    "notes": "<brief match assessment>"
  },

  "keywords": {
    "matched": <integer count>,
    "total": <integer count>,
    "found": ["keyword1", "keyword2", ...],
    "notFound": ["missing1", "missing2", ...]
  },

  "skillGap": {
    "present": ["skill1", ...],
    "missing": ["skill1", ...],
    "partial": ["skill1", ...]
  },

  "formatReview": {
    "overall": "<Excellent|Good|Fair|Poor>",
    "score": <integer 0-100>,
    "checks": [
      { "label": "Single page",       "status": "<pass|fail|partial>" },
      { "label": "Contact info",      "status": "<pass|fail|partial>" },
      { "label": "Tables/columns",    "status": "<pass|fail|partial>" },
      { "label": "Action verbs",      "status": "<pass|fail|partial>" },
      { "label": "Measurable results","status": "<pass|fail|partial>" },
      { "label": "Consistent dates",  "status": "<pass|fail|partial>" }
    ]
  },

  "suggestions": [
    { "text": "<actionable suggestion>", "priority": "<high|medium|low>" },
    { "text": "<actionable suggestion>", "priority": "<high|medium|low>" },
    { "text": "<actionable suggestion>", "priority": "<high|medium|low>" },
    { "text": "<actionable suggestion>", "priority": "<high|medium|low>" },
    { "text": "<actionable suggestion>", "priority": "<high|medium|low>" }
  ]
}

Scoring rubric:
- atsScore: weight format(25) + keywords(30) + skills(25) + readability(20)
- roleMatch: compare resume skills/experience vs typical JD requirements for the inferred role
- keywords: scan for common industry/role keywords; notFound = important ones absent
- skillGap: present = skills explicitly listed, missing = skills commonly required for role but absent, partial = skills mentioned briefly without depth
- formatReview: penalise tables, images, columns, graphics as ATS parsers fail on them
- suggestions: ranked by impact, specific and actionable`;

    // ── 5. Call OpenRouter ──
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Target role: ${parsedData.targetRole || "not specified"}
Experience: ${parsedData.experience || "unknown"}
Skills listed: ${(parsedData.skills || []).join(", ")}

Full resume text:
${resumeText}`,
        },
      ],
      temperature: 0.2,
    });

    // ── 6. Parse AI response ──
    const raw = completion.choices[0]?.message?.content || "{}";
    let analysisData;
    try {
      analysisData = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      analysisData = JSON.parse(cleaned);
    }

    // ── 7. Save to MongoDB ──
    await connect();

    const docToSave = {
      // userId,                          // uncomment when auth is wired
      resumeFileName: file.name,
      parsedInfo: parsedData,
      atsScore:     analysisData.atsScore,
      overallSummary: analysisData.overallSummary,
      roleMatch:    analysisData.roleMatch,
      keywords:     analysisData.keywords,
      skillGap:     analysisData.skillGap,
      formatReview: analysisData.formatReview,
      suggestions:  analysisData.suggestions,
    };

    const saved = await ResumeATS.create(docToSave);

    return NextResponse.json({
      message: "Analysis complete",
      data: analysisData,
      savedId: saved._id,
    });

  } catch (error) {
    console.error("ATS analysis error:", error.message);
    return NextResponse.json(
      { message: "ATS analysis failed: " + error.message },
      { status: 500 }
    );
  }
}