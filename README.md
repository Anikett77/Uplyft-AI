# Uplyft AI — AI-Powered Career Platform

<div align="center">

![Uplyft AI](https://img.shields.io/badge/Uplyft-AI-7c3aed?style=for-the-badge&logo=sparkles&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![GPT-4o](https://img.shields.io/badge/GPT--4o_mini-412991?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**The complete AI career loop — from resume to job-ready.**

[Live Demo](https://uplyft-ai.vercel.app) · [Report Bug](https://github.com/Anikett77/uplyft-ai/issues) · [Request Feature](https://github.com/Anikett77/uplyft-ai/issues)

</div>

---

## What is Uplyft AI?

Uplyft AI is a full-stack AI career platform that takes you from resume upload to interview-ready — automatically. Upload your resume once and every feature personalises itself: your ATS score, skill gaps, career roadmap, mock interviews, and learning plan are all generated from your actual data.

Built for students, freshers, and career switchers who want real answers, not generic advice.

---

## Features

### 📄 Resume Analyzer
- Parses PDF and DOCX resumes using `pdfreader`
- Generates an **ATS score (0–100)** with breakdown across keywords, formatting, skills, and role match
- Returns keyword gap analysis, format review checklist, and 5 prioritized improvement suggestions
- All powered by **GPT-4o mini via OpenRouter**

### 📊 Skill Gap Analysis
- Compares resume skills against target role requirements
- Color-coded tags: **Present** (green) · **Missing** (red) · **Partial** (yellow)
- Role compatibility score with match notes

### 🗺️ Career Roadmap
- Auto-generates a **5-phase personalized roadmap** from your current skills to your target role
- Each phase has a realistic timeframe, skill list, and status (Completed / In Progress / Upcoming)
- Roadmap adapts based on your resume data — no two roadmaps are the same

### 🎙️ AI Mock Interview
- **3 interview types**: Behavioral, Technical, Case Study
- **7 questions per session**, generated fresh each time using full session history as context (no repetition)
- Each answer gets: Score /10 · Strengths · Improvements · Model Answer · Actionable Tip
- **2-minute timer per question** — auto-submits on timeout
- Final **session report**: overall score, readiness label, strengths, improvements, per-question breakdown

### 📚 Learning Tracker
- Tracks active courses with module-by-module progress
- Daily task checklist with streak and hours counter
- **"Generate Learning Plan"** button maps your skill gaps to real courses (Coursera, Udemy, DeepLearning.AI, fast.ai, etc.)
- All data persists across sessions via localStorage

### 🐙 Portfolio Analyzer
- Enter any GitHub username — no auth, no tokens required (uses GitHub public API)
- Real stats: repositories, stars, forks, language breakdown by % usage
- **Code quality signals** inferred from repo metadata: documentation rate, topic usage, community impact, activity
- Recent activity feed from public events

### ⚙️ Settings & Auth
- JWT-based custom authentication (signup / login / logout)
- Per-user data isolation — each user's resume, ATS results, GitHub data, and learning state stored separately
- Profile management with live update to MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | MongoDB + Mongoose |
| AI | OpenRouter API (GPT-4o mini) |
| Resume Parsing | pdfreader |
| GitHub Data | GitHub REST API v3 |
| Auth | JWT (jsonwebtoken), bcrypt |
| State | localStorage (per-user keyed) + React Context |
| Deployment | Vercel |

---

## Project Structure

```
uplyft-ai/
├── app/
│   ├── api/
│   │   ├── auth/           # login, signup, logout
│   │   ├── users/          # /me endpoint
│   │   ├── resume-parse/   # PDF/DOCX parser
│   │   ├── analyze-resume/ # ATS scoring via GPT-4o
│   │   ├── interview/      # question, feedback, report
│   │   └── github-analyze/ # GitHub public API wrapper
│   └── dashboard/
│       ├── page.jsx        # SPA layout with sidebar
│       ├── resume.jsx
│       ├── skillgap.jsx
│       ├── roadmap.jsx
│       ├── interview.jsx
│       ├── learning.jsx
│       ├── portfolio.jsx
│       └── settings.jsx
├── hooks/
│   ├── useResumeState.js   # persistent resume + ATS state
│   ├── useGithubState.js   # persistent GitHub state
│   └── useLearningState.js # persistent learning state
├── context/
│   └── UserContext.js      # global user context
├── models/
│   ├── User.js
│   └── ResumeATS.js
└── components/
    └── LogoutButton.jsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB URI (local or Atlas)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

### Installation

```bash
git clone https://github.com/Anikett77/uplyft-ai.git
cd uplyft-ai
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_URL=http://localhost:3000

# Optional — increases GitHub API rate limit from 60/hr to 5000/hr
# GITHUB_TOKEN=your_github_personal_access_token
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

```
Upload Resume (PDF/DOCX)
        ↓
AI parses → extracts name, skills, education, experience
        ↓
ATS Analysis → score, keywords, format, role match
        ↓
Skill Gap → present / missing / partial skills identified
        ↓
Roadmap → 5-phase plan generated from your gaps
        ↓
Mock Interview → 7 personalized questions from your profile
        ↓
Learning Tracker → course plan built from missing skills
        ↓
Portfolio Analyzer → GitHub stats layered on top
```

Every feature reads from the same parsed resume — upload once, everything personalises automatically.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login + JWT cookie |
| GET | `/api/auth/logout` | Clear cookie + redirect |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |
| POST | `/api/resume-parse` | Parse resume → extract info |
| POST | `/api/analyze-resume` | ATS analysis + save to DB |
| POST | `/api/interview` | Generate question / feedback / report |
| GET | `/api/github-analyze?username=` | GitHub profile analysis |

---

## Screenshots

> Dashboard · Resume Analyzer · ATS Report · Mock Interview · Career Roadmap

*(Add your screenshots here)*

---

## Roadmap

- [ ] Job recommendations via LinkedIn/Naukri scraping
- [ ] AI Mentor Chat (persistent conversation)
- [ ] Resume PDF export with ATS-optimized template
- [ ] Team/referral features
- [ ] Email notifications for streak and reminders

---

## Author

**Aniket** — [@Anikett77](https://github.com/Anikett77)

If this helped you, leave a ⭐ — it means a lot and helps others find the project.

---

## License

MIT License — free to use, modify, and distribute.