"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LINKS = [
  { label: "Home",         href: "#home"        },
  { label: "Features",     href: "#features"    },
  { label: "How it Works", href: "#works"       },
  { label: "Testimonials", href: "#testimonial" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeLink,  setActiveLink]  = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setActiveLink(href);
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060810]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo */}
          <a href="#home" onClick={() => handleNav("#home")}
            className="flex items-center gap-2.5 group">
            <div className="w-10 h-10">
              <img className="w-15 h-15 object-cover object-centre" src="uplyft.svg" alt="" />
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight font-serif">
              Uplyft<span className="text-blue-400">AI</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleNav(l.href)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-150 font-serif ${
                    activeLink === l.href
                      ? "text-white bg-white/[0.07]"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all font-serif">
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
              Get Started →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white/70 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#060810]/95 backdrop-blur-xl px-5 py-4">
            <ul className="space-y-1 mb-4">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => handleNav(l.href)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-serif transition-all ${
                      activeLink === l.href ? "text-white bg-white/7" : "text-gray-400 hover:text-white hover:bg-white/4"
                    }`}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
              <button onClick={() => router.push("/login")}
                className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 border border-white/10 hover:border-white/20 transition-all font-serif">
                Sign In
              </button>
              <button onClick={() => router.push("/signup")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer so content doesn't sit behind fixed nav */}
      <div className="h-[64px]" />
    </>
  );
}