import { NextResponse } from "next/server";

const GH = "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  // Optional: add token for higher rate limit (60/hr → 5000/hr)
  // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

async function gh(path) {
  const res = await fetch(`${GH}${path}`, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} on ${path}`);
  return res.json();
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();
  if (!username) return NextResponse.json({ message: "Username required" }, { status: 400 });

  try {
    // ── 1. User profile ──
    const user = await gh(`/users/${username}`);

    // ── 2. All public repos (up to 100) ──
    const repos = await gh(`/users/${username}/repos?per_page=100&sort=updated`);

    // ── 3. Aggregate stats ──
    const totalStars   = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks   = repos.reduce((s, r) => s + r.forks_count, 0);
    const totalWatchers = repos.reduce((s, r) => s + r.watchers_count, 0);

    // ── 4. Language breakdown ──
    const langMap = {};
    for (const repo of repos) {
      if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
    const totalLangCount = Object.values(langMap).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        score: Math.round((count / totalLangCount) * 100),
      }));

    // ── 5. Top projects (by stars, then forks) ──
    const topProjects = [...repos]
      .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
      .slice(0, 6)
      .map(r => ({
        name:        r.name,
        description: r.description || "",
        lang:        r.language || "Unknown",
        stars:       r.stargazers_count,
        forks:       r.forks_count,
        url:         r.html_url,
        updatedAt:   r.updated_at,
        topics:      r.topics || [],
      }));

    // ── 6. Contribution activity (last year via events) ──
    let recentActivity = [];
    try {
      const events = await gh(`/users/${username}/events/public?per_page=30`);
      recentActivity = events.slice(0, 5).map(e => ({
        type: e.type,
        repo: e.repo?.name || "",
        date: e.created_at,
      }));
    } catch {}

    // ── 7. Quality signals (inferred from repo metadata) ──
    const hasReadme      = repos.filter(r => r.description).length;
    const hasTopics      = repos.filter(r => r.topics?.length > 0).length;
    const hasForks       = repos.filter(r => r.forks_count > 0).length;
    const recentlyActive = repos.filter(r => {
      const d = new Date(r.updated_at);
      return (Date.now() - d) < 1000 * 60 * 60 * 24 * 90; // updated in last 90 days
    }).length;

    const qualityMetrics = [
      {
        name:  "Documentation",
        score: Math.min(100, Math.round((hasReadme / Math.max(repos.length, 1)) * 100)),
        color: "from-violet-400 to-purple-500",
      },
      {
        name:  "Project Discoverability",
        score: Math.min(100, Math.round((hasTopics / Math.max(repos.length, 1)) * 100)),
        color: "from-sky-400 to-blue-500",
      },
      {
        name:  "Community Impact",
        score: Math.min(100, Math.round((hasForks / Math.max(repos.length, 1)) * 100)),
        color: "from-emerald-400 to-teal-500",
      },
      {
        name:  "Activity (90 days)",
        score: Math.min(100, Math.round((recentlyActive / Math.max(repos.length, 1)) * 100)),
        color: "from-amber-400 to-orange-500",
      },
      {
        name:  "Stars per Repo",
        score: Math.min(100, Math.round(Math.min((totalStars / Math.max(repos.length, 1)) * 10, 100))),
        color: "from-rose-400 to-pink-500",
      },
      {
        name:  "Repo Diversity",
        score: Math.min(100, Object.keys(langMap).length * 14),
        color: "from-cyan-400 to-sky-500",
      },
    ];

    const overallQuality = Math.round(qualityMetrics.reduce((s, m) => s + m.score, 0) / qualityMetrics.length);

    return NextResponse.json({
      profile: {
        username:  user.login,
        name:      user.name || user.login,
        avatar:    user.avatar_url,
        bio:       user.bio || "",
        location:  user.location || "",
        followers: user.followers,
        following: user.following,
        url:       user.html_url,
        joinedAt:  user.created_at,
      },
      stats: {
        repos:          repos.length,
        stars:          totalStars,
        forks:          totalForks,
        watchers:       totalWatchers,
        overallQuality,
        contributions:  user.public_gists + repos.length, // proxy
      },
      languages,
      topProjects,
      qualityMetrics,
      recentActivity,
    });

  } catch (err) {
    const is404 = err.message.includes("404");
    return NextResponse.json(
      { message: is404 ? "GitHub user not found" : err.message },
      { status: is404 ? 404 : 500 }
    );
  }
}