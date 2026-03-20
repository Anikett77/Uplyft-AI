import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ── Auth ──────────────────────────────
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
 
    // ── Profile Status ────────────────────
    profileCompleted: {
      type: Boolean,
      default: false,
    },
 
    // ── Personal Info (filled at onboarding) ──
    fullName: { type: String, default: "" },
    college:  { type: String, default: "" },
    degree:   { type: String, default: "" },
    branch:   { type: String, default: "" },
    cgpa:     { type: String, default: "" },
 
    // ── Career Info ───────────────────────
    skills:     { type: [String], default: [] },
    interests:  { type: [String], default: [] },
    targetRole: { type: String, default: "" },
    experience: { type: String, default: "" },
 
    // ── Verification (optional, keep if you have it) ──
    isVerified:          { type: Boolean, default: false },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken:         String,
    verifyTokenExpiry:   Date,
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;