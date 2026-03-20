"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

// ── Spline loaded client-side only (fixes SSR crash) ──
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

const SUGGESTED_SKILLS = ["JavaScript", "React", "Node.js", "Python", "TypeScript", "Next.js"];
const SUGGESTED_INTERESTS = ["Web Development", "Mobile Apps", "AI/ML", "Backend Development", "Frontend Development"];

export default function ProfileForm() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [parsing, setParsing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    college: "",
    degree: "",
    branch: "",
    cgpa: "",
    targetRole: "",
    experience: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Skills ──
  const addSkill = (val) => {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((s) => [...s, trimmed]);
    setSkillInput("");
  };
  const removeSkill = (i) => setSkills((s) => s.filter((_, idx) => idx !== i));

  // ── Interests ──
  const addInterest = (val) => {
    const trimmed = val.trim();
    if (trimmed && !interests.includes(trimmed)) setInterests((s) => [...s, trimmed]);
    setInterestInput("");
  };
  const removeInterest = (i) => setInterests((s) => s.filter((_, idx) => idx !== i));

  // ── Reset ──
  const handleReset = () => {
    setForm({ fullName: "", college: "", degree: "", branch: "", cgpa: "", targetRole: "", experience: "" });
    setSkills([]);
    setInterests([]);
    setSkillInput("");
    setInterestInput("");
    setResumeFile(null);
  };

  // ── Resume drop ──
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setResumeFile(file);
    else toast.error("Please upload a PDF file");
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") setResumeFile(file);
    else toast.error("Please upload a PDF file");
  };

  // ── Parse Resume ──
  const parseResume = async () => {
    if (!resumeFile) return;
    setParsing(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      const res = await axios.post("/api/resume/parse", formData);
      const parsed = res.data.data;
      setForm({
        fullName: parsed.fullName || "",
        college: parsed.college || "",
        degree: parsed.degree || "",
        branch: parsed.branch || "",
        cgpa: parsed.cgpa || "",
        targetRole: parsed.targetRole || "",
        experience: parsed.experience || "",
      });
      setSkills(parsed.skills || []);
      setInterests(parsed.interests || []);
      toast.success("Resume parsed! Review your details.");
    } catch {
      toast.error("Could not parse resume. Fill manually.");
    } finally {
      setParsing(false);
    }
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!form.fullName || !form.targetRole || skills.length === 0) {
      toast.error("Please fill Full Name, Target Role, and at least one Skill.");
      return;
    }
    setLoading(true);
    try {
      await axios.put("/api/profile", { ...form, skills, interests });
      toast.success("Profile saved! Welcome 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">

      {/* ── Spline 3D Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Spline scene="https://prod.spline.design/KsAYMi9P1EDwvOyz/scene.splinecode" />
      </div>

      {/* ── Page Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center py-12 px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-serif text-foreground">Build Your Profile</h1>
          <p className="text-lg mt-3 text-muted-foreground">Let&apos;s get to know you better</p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-4xl bg-background/70  rounded-2xl p-8 shadow-xl space-y-8">

          {/* ── Resume Upload ── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed px-6 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
              ${dragging
                ? "border-sky-400 bg-sky-50/10"
                : resumeFile
                ? "border-green-400 bg-green-50/10"
                : "border-sky-400 hover:border-sky-600 hover:shadow-md"
              }`}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            {parsing ? (
              <div className="flex flex-col items-center gap-2">
                <span className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Parsing your resume...</p>
              </div>
            ) : resumeFile ? (
              <>
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-green-500">{resumeFile.name}</p>
                <p className="text-xs text-muted-foreground">{(resumeFile.size / 1024).toFixed(1)} KB · PDF</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); parseResume(); }}
                  className="mt-2 px-4 py-1.5 rounded-md bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition"
                >
                  Parse with AI →
                </button>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-foreground">Upload Your Resume</p>
                <p className="text-xs text-muted-foreground">Drop your PDF resume to auto-fill your details</p>
              </>
            )}
          </div>

          {/* ── Personal Information ── */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter Your Name"
                className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">College / University</label>
              <input name="college" value={form.college} onChange={handleChange} placeholder="Enter Your Collegem"
                className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Degree</label>
                <input name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech"
                  className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                <input name="branch" value={form.branch} onChange={handleChange} placeholder="Computer Science"
                  className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">CGPA</label>
              <input name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="8.5"
                className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
            </div>
          </div>

          {/* ── Career Information ── */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Career Information</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Role</label>
              <input name="targetRole" value={form.targetRole} onChange={handleChange}
                placeholder="e.g., Software Engineer, Product Manager"
                className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience</label>
              <textarea name="experience" value={form.experience} onChange={handleChange}
                placeholder="Describe your work experience or years of experience"
                rows={4}
                className="w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground resize-none" />
            </div>

            {/* ── Skills ── */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Skills</label>
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); } }}
                  placeholder="Add a skill..."
                  className="flex-1 rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                <button type="button" onClick={() => addSkill(skillInput)}
                  className="px-4 py-2 rounded-md bg-primary bg-blue-500 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
                  +
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-400 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      {s}
                      <button type="button" onClick={() => removeSkill(i)} className="ml-1 text-primary/60 hover:text-red-500 transition">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="pt-1">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addSkill(s)}
                      className="text-xs px-3 py-1 rounded-full bg-muted bg-gray-200/70 backdrop:blur-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Interests ── */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Interests</label>
              <div className="flex gap-2">
                <input value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addInterest(interestInput); } }}
                  placeholder="Add an interest..."
                  className="flex-1 rounded-md border border-input border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                <button type="button" onClick={() => addInterest(interestInput)}
                  className="px-4 py-2 rounded-md bg-primary bg-blue-500 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
                  +
                </button>
              </div>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-400 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      {item}
                      <button type="button" onClick={() => removeInterest(i)} className="ml-1 text-primary/60 hover:text-red-500 transition">×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="pt-1">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_INTERESTS.filter((s) => !interests.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addInterest(s)}
                      className="text-xs px-3 py-1 rounded-full bg-muted bg-gray-200/70 backdrop:blur-xl hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Buttons ── */}
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={handleReset}
              className="flex-1 py-3 rounded-md border border-input border-gray-300 bg-background text-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground transition shadow-sm">
              Reset
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-md bg-primary text-primary-foreground bg-blue-500 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 bg-blue-500 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Complete Profile"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}