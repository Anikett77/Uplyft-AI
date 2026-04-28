"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";

// ── Spline loaded client-side only (fixes SSR crash) ──
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen px-4 py-10 bg-black text-white">
  
  {/* Spline Background */}
  {/* <div className="fixed inset-0 z-0 ">
    <Spline scene="https://prod.spline.design/KsAYMi9P1EDwvOyz/scene.splinecode" />
  </div> */}
              <div className="absolute -top-32 -right-24 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.30] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-sky-700 opacity-[0.40] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-emerald-700 opacity-[0.67] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

  {/* Content — z-10 se upar rahega */}
  <div className="relative z-10 max-w-4xl mx-auto space-y-6">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          Dashboard →
        </button>
        <LogoutButton router={router} />
      </div>
    </div>

    {/* Personal Info */}
    <div className="rounded-2xl bg-blue-950/50 p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground border-b border-gray-500 pb-2">
        Personal Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Detail label="Full Name"  value={user.fullName} />
        <Detail label="Email"      value={user.email} />
        <Detail label="College"    value={user.college} />
        <Detail label="Degree"     value={user.degree} />
        <Detail label="Branch"     value={user.branch} />
        <Detail label="CGPA"       value={user.cgpa} />
      </div>
    </div>

    {/* Career Info */}
    <div className="rounded-2xl bg-blue-950/50 p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground border-b border-gray-500 pb-2">
        Career Information
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Detail label="Target Role" value={user.targetRole} />
        <Detail label="Experience"  value={user.experience} />
      </div>
    </div>

    {/* Skills */}
    <div className="rounded-2xl bg-blue-950/50 p-6 space-y-3 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground border-b border-gray-500 pb-2">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {user.skills?.length > 0
          ? user.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
                {skill}
              </span>
            ))
          : <p className="text-gray-400 text-sm">No skills added</p>
        }
      </div>
    </div>

    {/* Interests */}
    <div className="rounded-2xl bg-blue-950/50 p-6 space-y-3 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground border-b border-gray-500 pb-2">
        Interests
      </h2>
      <div className="flex flex-wrap gap-2">
        {user.interests?.length > 0
          ? user.interests.map((item, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
                {item}
              </span>
            ))
          : <p className="text-gray-400 text-sm">No interests added</p>
        }
      </div>
    </div>

  </div>
</div>
  );
}

// ── Detail Component ──
function Detail({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-foreground font-medium">{value || "—"}</p>
    </div>
  );
}

// ── Logout Button ──
function LogoutButton({ router }) {
  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-500 hover:text-white transition text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
}