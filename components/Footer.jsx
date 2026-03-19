export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 border-gray-900 font-serif">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        <div className="grid gap-8 lg:grid-cols-6">
          
          {/* Logo + About */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                ✨
              </div>
              <span className="text-lg font-semibold text-foreground text-white">
                Career Mentor
              </span>
            </a>

            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed text-gray-400">
              Your AI-powered career mentor. Analyze resumes, identify skill gaps,
              and accelerate your professional growth.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-4">
              {["T", "L", "G", "Y"].map((icon, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground text-white">
              Product
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground text-gray-400">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="/dashboard/resume-analyzer" className="hover:text-foreground">Resume Analyzer</a></li>
              <li><a href="/dashboard/career-roadmap" className="hover:text-foreground">Career Roadmap</a></li>
              <li><a href="/dashboard/mock-interview" className="hover:text-foreground">AI Interview</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground text-white">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground text-gray-400">
              <li><a href="#" className="hover:text-foreground">About</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Press</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground text-white">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground text-gray-400">
              <li><a href="#" className="hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground">Community</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground text-white">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground text-gray-400">
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row border-gray-900">
          <p className="text-sm text-muted-foreground text-gray-400">
            © 2026 CareerAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground text-gray-400">
            Made with AI for your career success 🚀
          </p>
        </div>

      </div>
    </footer>
  );
}