import { NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import ResumeATS from "@/app/models/resumeATS";

export async function GET() {
  try {
    await connect();

    // 🔥 latest ATS data
    const latest = await ResumeATS.findOne().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: latest,
    });

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}