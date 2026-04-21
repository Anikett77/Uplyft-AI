import mongoose from "mongoose";

// ── Sub-schemas ────────────────────────────────────────────────────────────

const CheckSchema = new mongoose.Schema({
  label:  { type: String },
  status: { type: String, enum: ["pass", "fail", "partial"] },
}, { _id: false });

const SuggestionSchema = new mongoose.Schema({
  text:     { type: String },
  priority: { type: String, enum: ["high", "medium", "low"] },
}, { _id: false });

// ── Main schema ────────────────────────────────────────────────────────────

const ResumeATSSchema = new mongoose.Schema(
  {
    // ── Link to user (wire up when auth is ready) ──
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    resumeFileName: { type: String },

    // ── Step 1 parsed data (stored for reference) ──
    parsedInfo: {
      fullName:   { type: String },
      college:    { type: String },
      degree:     { type: String },
      branch:     { type: String },
      cgpa:       { type: String },
      targetRole: { type: String },
      experience: { type: String },
      skills:     [{ type: String }],
      interests:  [{ type: String }],
    },

    // ── ATS analysis results ──
    atsScore:       { type: Number, min: 0, max: 100 },
    overallSummary: { type: String },

    roleMatch: {
      score: { type: Number, min: 0, max: 100 },
      role:  { type: String },
      notes: { type: String },
    },

    keywords: {
      matched:  { type: Number, default: 0 },
      total:    { type: Number, default: 0 },
      found:    [{ type: String }],
      notFound: [{ type: String }],
    },

    skillGap: {
      present: [{ type: String }],
      missing: [{ type: String }],
      partial: [{ type: String }],
    },

    formatReview: {
      overall: { type: String, enum: ["Excellent", "Good", "Fair", "Poor"] },
      score:   { type: Number, min: 0, max: 100 },
      checks:  [CheckSchema],
    },

    suggestions: [SuggestionSchema],
  },
  {
    timestamps: true,   // createdAt + updatedAt auto-added
  }
);

// ── Index for quick user-history queries ──
ResumeATSSchema.index({ userId: 1, createdAt: -1 });

// ── Prevent model recompilation in Next.js hot-reload ──
export default mongoose.models.ResumeATS ||
  mongoose.model("ResumeATS", ResumeATSSchema);