export default function Testimonials() {
  const testimonials = [
    {
      name: "Saurabh Sharma",
      role: "Software Engineer at Google",
      initials: "SS",
      text: "CareerAI helped me identify the exact skills I needed to land my dream job. The AI mock interviews boosted my confidence."
    },
    {
      name: "Rohit Mehta",
      role: "Data Scientist at Meta",
      initials: "RM",
      text: "The career roadmap feature gave me a clear path from developer to data scientist with actionable steps."
    },
    {
      name: "Ananya Verma",
      role: "Product Manager at Amazon",
      initials: "AV",
      text: "The resume analyzer caught issues I never noticed. After improvements, my callback rate doubled."
    },
    {
      name: "Deepak Kumar",
      role: "Full Stack Developer at Stripe",
      initials: "DK",
      text: "Skill gap analysis showed exactly what I was missing. Within months, I got offers from top companies."
    },
    {
      name: "Neha Kapoor",
      role: "AI Engineer at OpenAI",
      initials: "NK",
      text: "The AI mentor feels like having a senior engineer 24/7. It helped me take better career decisions."
    },
    {
      name: "Aman Jain",
      role: "DevOps Lead at Netflix",
      initials: "AJ",
      text: "From resume to interview prep, everything is covered. Best investment in my career."
    }
  ];

  return (
    <section id="testimonial" className="relative py-24 sm:py-32 overflow-hidden font-serif">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center font-serif">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary text-blue-600 font-serif">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-white">
            Loved by professionals worldwide
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:scale-105 border-blue-900/20 bg-blue-950/10"
            >
              
              {/* Stars */}
              <div className="mb-4 flex gap-1 text-primary">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-current text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 17l-5.9 3.1 1.2-6.6L2.5 8.9l6.6-.9L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="mb-6 text-muted-foreground leading-relaxed text-gray-400">
                "{item.text}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary text-blue-500">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground text-gray-400">
                    {item.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}