"use client";

export default function LogoutButton({ className = "" }) {
  const handleLogout = () => {
    // Just clear the auth cookie and redirect — localStorage stays intact
    window.location.href = "/api/users/logout";
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className={`w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 text-white/30 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10 transition-all duration-200 shrink-0 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}