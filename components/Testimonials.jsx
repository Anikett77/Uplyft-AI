import React from 'react';

const TESTIMONIALS = [
  {
    name: "Saurabh Sharma",
    role: "Software Engineer at Google",
    initials: "SS",
    color: "from-sky-500 to-blue-600",
    text: "The ATS analyser showed I was missing 8 keywords recruiters look for. After fixing them my interview callbacks went from 2 to 11 in a single month.",
    highlight: "2 → 11 callbacks",
  },
  {
    name: "Rohit Mehta",
    role: "Data Scientist at Meta",
    initials: "RM",
    color: "from-violet-500 to-purple-600",
    text: "The career roadmap gave me a clear 9-month path from backend dev to data scientist — with specific courses and milestones. I followed it exactly and got the role.",
    highlight: "9-month roadmap",
  },
  {
    name: "Ananya Verma",
    role: "Product Manager at Amazon",
    initials: "AV",
    color: "from-emerald-500 to-teal-600",
    text: "My resume had a multi-column layout that was failing ATS parsers. The format review caught it immediately. One fix and my applications finally started getting responses.",
    highlight: "Format fix = responses",
  },
  {
    name: "Deepak Kumar",
    role: "Full Stack Dev at Stripe",
    initials: "DK",
    color: "from-rose-500 to-pink-600",
    text: "Skill gap analysis told me exactly what I was missing for senior roles — TypeScript, system design, and Docker. Six months of focused learning and I had offers from 3 top companies.",
    highlight: "3 offers in 6 months",
  },
  {
    name: "Neha Kapoor",
    role: "AI Engineer at OpenAI",
    initials: "NK",
    color: "from-amber-500 to-orange-500",
    text: "I did 14 AI mock interviews before my actual ones. The feedback on my technical answers was incredibly specific — it felt like practicing with a senior engineer.",
    highlight: "14 mock sessions",
  },
  {
    name: "Aman Jain",
    role: "DevOps Lead at Netflix",
    initials: "AJ",
    color: "from-cyan-500 to-sky-600",
    text: "From ATS score 42 to 84 in two weeks. The keyword checker told me exactly which terms to add and where. Worth every minute.",
    highlight: "42 → 84 ATS score",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonial" className="relative py-24 px-4 overflow-hidden font-serif bg-black">
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] rounded-full bg-violet-700 opacity-[0.06] blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] tracking-widest uppercase text-blue-400 font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-white">Loved by professionals worldwide</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">Real results from real people who used CareerAI to land their dream roles.</p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <div key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-900/40 hover:bg-blue-950/10 hover:scale-[1.02]">

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} viewBox="0 0 24 24" className="h-4 w-4 fill-blue-500">
                    <path d="M12 2l2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 17l-5.9 3.1 1.2-6.6L2.5 8.9l6.6-.9L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Highlight badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-400 mb-3">
                <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 fill-blue-400"><circle cx="3" cy="3" r="3"/></svg>
                {item.highlight}
              </div>

              {/* Text */}
              <p className="text-gray-400 leading-relaxed text-sm mb-5">"{item.text}"</p>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}