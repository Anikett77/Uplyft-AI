// app/api/profile/route.js
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function PUT(request) {
  try {
    const userId = await getDataFromToken(request);
    const body = await request.json();

    const {
      fullName,
      college,
      degree,
      branch,
      cgpa,
      skills,
      interests,
      targetRole,
      experience,
    } = body;

    // Basic validation
    if (!fullName || !targetRole || !skills?.length) {
      return NextResponse.json(
        { message: "Full Name, Target Role, and at least one Skill are required." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        college,
        degree,
        branch,
        cgpa,
        skills,
        interests,
        targetRole,
        experience,
        profileCompleted: true,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}