"use client";
import { useState, useEffect } from "react";

const KEY = "learning_state";

// ── Suggested courses seeded from resume skill gaps ───────────────────────
export function buildSuggestedCourses(ats, parsed) {
  const missing  = ats?.skillGap?.missing  || [];
  const partial  = ats?.skillGap?.partial  || [];
  const role     = ats?.roleMatch?.role    || parsed?.targetRole || "Software Engineer";

  const COURSE_MAP = {
    // Frontend
    "TypeScript":     { title:"TypeScript Deep Dive",         platform:"Udemy",            icon:"📘", color:"from-blue-500 to-indigo-600",    tag:"text-blue-400",    tagBg:"bg-blue-500/10 border-blue-500/20"    },
    "Next.js":        { title:"Next.js 14 Complete Guide",    platform:"YouTube / Vercel",  icon:"▲",  color:"from-slate-400 to-gray-600",     tag:"text-slate-400",   tagBg:"bg-slate-500/10 border-slate-500/20"  },
    "React":          { title:"React Advanced Patterns",      platform:"Frontend Masters",  icon:"⚛️", color:"from-sky-500 to-blue-500",       tag:"text-sky-400",     tagBg:"bg-sky-500/10 border-sky-500/20"      },
    "GraphQL":        { title:"GraphQL with Apollo",          platform:"Egghead",           icon:"🔗", color:"from-pink-500 to-rose-500",      tag:"text-pink-400",    tagBg:"bg-pink-500/10 border-pink-500/20"    },
    "Testing":        { title:"Testing JavaScript",           platform:"TestingJS.com",     icon:"🧪", color:"from-red-500 to-orange-500",     tag:"text-red-400",     tagBg:"bg-red-500/10 border-red-500/20"      },
    // Backend
    "Node.js":        { title:"Node.js Complete Bootcamp",    platform:"Udemy",             icon:"🟢", color:"from-emerald-500 to-teal-500",   tag:"text-emerald-400", tagBg:"bg-emerald-500/10 border-emerald-500/20"},
    "Docker":         { title:"Docker & Kubernetes",          platform:"Udemy",             icon:"🐳", color:"from-sky-500 to-cyan-500",       tag:"text-cyan-400",    tagBg:"bg-cyan-500/10 border-cyan-500/20"    },
    "PostgreSQL":     { title:"PostgreSQL Mastery",           platform:"DataCamp",          icon:"🐘", color:"from-blue-500 to-violet-500",    tag:"text-blue-400",    tagBg:"bg-blue-500/10 border-blue-500/20"    },
    "Redis":          { title:"Redis Fundamentals",           platform:"Redis University",  icon:"🔴", color:"from-red-500 to-rose-600",       tag:"text-rose-400",    tagBg:"bg-rose-500/10 border-rose-500/20"    },
    // AI/ML
    "Python":         { title:"Python for Data Science",      platform:"Coursera",          icon:"🐍", color:"from-yellow-500 to-amber-500",   tag:"text-amber-400",   tagBg:"bg-amber-500/10 border-amber-500/20"  },
    "LangChain":      { title:"LangChain & LLM Apps",         platform:"DeepLearning.AI",   icon:"🦜", color:"from-violet-500 to-purple-600",  tag:"text-violet-400",  tagBg:"bg-violet-500/10 border-violet-500/20"},
    "PyTorch":        { title:"Deep Learning with PyTorch",   platform:"fast.ai",           icon:"🔥", color:"from-orange-500 to-red-500",     tag:"text-orange-400",  tagBg:"bg-orange-500/10 border-orange-500/20"},
    "MLOps":          { title:"MLOps Specialisation",         platform:"Coursera",          icon:"⚙️", color:"from-teal-500 to-emerald-600",   tag:"text-teal-400",    tagBg:"bg-teal-500/10 border-teal-500/20"    },
    "Fine-tuning":    { title:"LLM Fine-tuning",              platform:"Hugging Face",      icon:"🤗", color:"from-yellow-500 to-orange-400",  tag:"text-yellow-400",  tagBg:"bg-yellow-500/10 border-yellow-500/20"},
    // DevOps
    "Kubernetes":     { title:"Kubernetes for Developers",    platform:"Linux Foundation",  icon:"☸️", color:"from-blue-500 to-sky-600",       tag:"text-sky-400",     tagBg:"bg-sky-500/10 border-sky-500/20"      },
    "CI/CD":          { title:"GitHub Actions & CI/CD",       platform:"GitHub Learning",   icon:"🔄", color:"from-slate-500 to-gray-600",     tag:"text-slate-400",   tagBg:"bg-slate-500/10 border-slate-500/20"  },
    // General
    "System Design":  { title:"System Design Interview",      platform:"Educative",         icon:"🏗️", color:"from-pink-500 to-rose-500",      tag:"text-pink-400",    tagBg:"bg-pink-500/10 border-pink-500/20"    },
    "DSA":            { title:"DSA Masterclass",              platform:"Udemy",             icon:"📊", color:"from-violet-500 to-indigo-600",  tag:"text-violet-400",  tagBg:"bg-violet-500/10 border-violet-500/20"},
    "AWS":            { title:"AWS Solutions Architect",      platform:"A Cloud Guru",      icon:"☁️", color:"from-amber-500 to-orange-500",   tag:"text-amber-400",   tagBg:"bg-amber-500/10 border-amber-500/20"  },
    "Vector DBs":     { title:"Vector Databases Essentials",  platform:"DeepLearning.AI",   icon:"🗄️", color:"from-cyan-500 to-teal-600",      tag:"text-cyan-400",    tagBg:"bg-cyan-500/10 border-cyan-500/20"    },
  };

  const FALLBACKS = [
    { title:`${role} Interview Prep`,    platform:"Educative",   icon:"🎯", color:"from-pink-500 to-rose-500",     tag:"text-pink-400",    tagBg:"bg-pink-500/10 border-pink-500/20"    },
    { title:"Clean Code Principles",     platform:"Pluralsight", icon:"✨", color:"from-emerald-500 to-teal-500",  tag:"text-emerald-400", tagBg:"bg-emerald-500/10 border-emerald-500/20"},
    { title:"Git & GitHub Mastery",      platform:"Udemy",       icon:"🐙", color:"from-gray-500 to-slate-600",   tag:"text-gray-400",    tagBg:"bg-gray-500/10 border-gray-500/20"    },
    { title:"Soft Skills for Engineers", platform:"LinkedIn",    icon:"🤝", color:"from-blue-500 to-indigo-500",  tag:"text-blue-400",    tagBg:"bg-blue-500/10 border-blue-500/20"    },
    { title:"Open Source Contributing",  platform:"GitHub",      icon:"🌍", color:"from-orange-500 to-amber-500", tag:"text-orange-400",  tagBg:"bg-orange-500/10 border-orange-500/20"},
  ];

  const allGaps  = [...missing, ...partial];
  const matched  = allGaps
    .map(s => COURSE_MAP[s] || COURSE_MAP[Object.keys(COURSE_MAP).find(k => s.toLowerCase().includes(k.toLowerCase()))])
    .filter(Boolean)
    .slice(0, 6);

  const suggestions = matched.length >= 3
    ? matched
    : [...matched, ...FALLBACKS].slice(0, 5);

  return suggestions.map((c, i) => ({
    id:       `suggested-${i}`,
    ...c,
    modules:  0,
    totalModules: Math.floor(Math.random() * 12) + 10,
    pct:      0,
    last:     null,
    status:   "not_started",  // not_started | active | completed
    suggested: true,
  }));
}

// ── Build daily tasks from skill gaps ─────────────────────────────────────
export function buildDefaultTasks(ats, parsed) {
  const missing  = ats?.skillGap?.missing || [];
  const role     = ats?.roleMatch?.role || parsed?.targetRole || "your target role";
  const tasks    = [];

  if (missing[0]) tasks.push({ text: `Study ${missing[0]} basics`, done: false });
  if (missing[1]) tasks.push({ text: `Watch intro to ${missing[1]}`, done: false });
  tasks.push({ text: `Practice LeetCode — 1 problem`, done: false });
  tasks.push({ text: `Review notes from last session`, done: false });
  tasks.push({ text: `Read 1 article about ${role}`, done: false });

  return tasks.slice(0, 5).map((t, i) => ({ ...t, id: `task-${Date.now()}-${i}` }));
}

// ── Default state ─────────────────────────────────────────────────────────
const defaults = {
  courses:       [],    // active/completed user courses
  tasks:         [],    // today's tasks
  streak:        1,
  hoursLearned:  0,
  lastActiveDay: null,
  planGenerated: false,
};

export function useLearningState() {
  const [state, setRaw]    = useState(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setRaw(JSON.parse(s));
    } catch {}
    setHydrated(true);
  }, []);

  const save = (updater) => {
    setRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clear = () => { localStorage.removeItem(KEY); setRaw(defaults); };

  // ── Course actions ──
  const addCourse = (course) => save(s => ({
    ...s, courses: [...s.courses, { ...course, id: `c-${Date.now()}`, pct: 0, modules: 0, last: null, status:"active" }]
  }));

  const updateCourse = (id, patch) => save(s => ({
    ...s, courses: s.courses.map(c => c.id === id ? { ...c, ...patch } : c)
  }));

  const removeCourse = (id) => save(s => ({ ...s, courses: s.courses.filter(c => c.id !== id) }));

  // ── Task actions ──
  const toggleTask = (id) => save(s => ({
    ...s,
    tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t),
    hoursLearned: s.hoursLearned + 0.25,
  }));

  const addTask = (text) => save(s => ({
    ...s, tasks: [...s.tasks, { id:`t-${Date.now()}`, text, done: false }]
  }));

  const removeTask = (id) => save(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }));

  // ── Seed plan from resume data ──
  const seedPlan = (ats, parsed) => {
    const suggestedCourses = buildSuggestedCourses(ats, parsed);
    const defaultTasks     = buildDefaultTasks(ats, parsed);
    save(s => ({
      ...s,
      courses:       suggestedCourses,
      tasks:         defaultTasks,
      planGenerated: true,
    }));
  };

  return {
    ...state, hydrated,
    save, clear,
    addCourse, updateCourse, removeCourse,
    toggleTask, addTask, removeTask,
    seedPlan,
  };
}