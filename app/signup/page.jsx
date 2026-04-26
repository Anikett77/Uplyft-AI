"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0 && user.username.length > 0));
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#060d1a] flex items-center justify-end overflow-hidden">

      {/* Spline 3D background */}
      <div className="absolute inset-0 w-full h-full">
        <Spline scene="https://prod.spline.design/tM5aVTqwc4uR8a2Q/scene.splinecode" />
      </div>

      {/* Right-side fade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04091480] via-[#04091450] to-transparent pointer-events-none z-[1]" />

      {/* Signup card */}
      <div className="relative z-10 w-[370px] mr-[65vw] p-[38px_34px] rounded-2xl bg-[#060e1ea8] border border-white/[0.07] backdrop-blur-xl max-sm:mr-0 max-sm:mx-4">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10">
              <img className="w-15 h-15 object-cover object-centre" src="uplyft.svg" alt="" />
            </div>
          <span className="text-sm font-semibold text-blue-200/80 tracking-wide">Uplyft</span>
        </div>

        <h1 className="text-[22px] font-semibold text-[#e8f2ff] tracking-tight mb-1">Create account</h1>
        <p className="text-[13px] font-light text-blue-200/40 mb-7">Sign up to get started</p>

        {/* Username */}
        <div className="mb-3.5">
          <label className="block text-[11px] font-medium text-blue-200/45 uppercase tracking-[0.7px] mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="yourname"
            className="w-full h-11 rounded-[9px] border border-white/[0.07] bg-white/[0.03] text-[#d8ecff] text-[13.5px] px-3.5 outline-none transition-all duration-150 placeholder:text-blue-300/25 focus:border-blue-500/40 focus:bg-blue-500/[0.04]"
          />
        </div>

        {/* Email */}
        <div className="mb-3.5">
          <label className="block text-[11px] font-medium text-blue-200/45 uppercase tracking-[0.7px] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full h-11 rounded-[9px] border border-white/[0.07] bg-white/[0.03] text-[#d8ecff] text-[13.5px] px-3.5 outline-none transition-all duration-150 placeholder:text-blue-300/25 focus:border-blue-500/40 focus:bg-blue-500/[0.04]"
          />
        </div>

        {/* Password */}
        <div className="mb-3.5">
          <label className="block text-[11px] font-medium text-blue-200/45 uppercase tracking-[0.7px] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="••••••••"
              className="w-full h-11 rounded-[9px] border border-white/[0.07] bg-white/[0.03] text-[#d8ecff] text-[13.5px] pl-3.5 pr-10 outline-none transition-all duration-150 placeholder:text-blue-300/25 focus:border-blue-500/40 focus:bg-blue-500/[0.04]"
            />
            <button
              tabIndex={-1}
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/35 hover:text-blue-300/70 transition-colors"
            >
              {showPass ? (
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center gap-2 mt-1.5 mb-5">
          <input type="checkbox" className="accent-blue-500 cursor-pointer" />
          <label className="text-xs text-blue-200/40 select-none cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-blue-400/70 hover:text-blue-400 transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-400/70 hover:text-blue-400 transition-colors">Privacy Policy</a>
          </label>
        </div>

        {/* Sign Up button */}
        <button
          disabled={buttonDisabled || loading}
          onClick={onSignup}
          className="w-full h-11 rounded-[9px] bg-blue-700 hover:bg-blue-600 text-white text-[13.5px] font-semibold transition-all duration-150 hover:-translate-y-px active:translate-y-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
              Creating account…
            </>
          ) : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2.5 my-4">
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[11px] text-blue-200/22">or</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        {/* Google */}
        <button className="w-full h-[42px] rounded-[9px] border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.11] text-[13px] font-medium text-blue-200/60 hover:text-blue-200/80 transition-all duration-150 flex items-center justify-center gap-2">
          <svg width="15" height="15" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[12.5px] text-blue-200/35 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}