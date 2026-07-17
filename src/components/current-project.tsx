export default function CurrentProject() {
  const features = [
    { label: "Multi-currency expense tracking", done: true },
    { label: "Email OTP authentication", done: true },
    { label: "AI-powered receipt scanning (YOLO)", done: true },
    { label: "Smart categorization & budgets", done: true },
    { label: "Multi-agent AI assistant (Google ADK)", done: true },
    { label: "Bank sync integration", done: false },
    { label: "Monthly report export", done: false },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:border-[var(--accent)]/30">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
            In Progress
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text)]">
              Deneb
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Full-stack expense tracking platform
            </p>
          </div>
          <div className="flex -space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[var(--accent)]/10 text-[var(--accent)]">
              React
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]">
              Go
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-[var(--accent)]/10 text-[var(--accent)]">
              AI
            </span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[var(--muted-foreground)] mb-4">
          A modular expense tracker with a Go backend, React frontend, and
          multi-agent AI system for receipt scanning, categorization, and
          financial insights.
        </p>

        <div className="flex flex-col gap-1.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs">
              <span
                className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  f.done
                    ? "bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]"
                    : "bg-[var(--surface-low)] text-[var(--muted-foreground)]"
                }`}
              >
                {f.done ? (
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </span>
              <span
                className={`${f.done ? "text-[var(--text)]" : "text-[var(--muted-foreground)]"}`}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)] px-5 sm:px-6 py-3 flex items-center justify-between">
        <a
          href="/writing"
          className="text-[11px] font-medium text-[var(--accent)] no-underline hover:underline underline-offset-2 transition-all"
        >
          Read about the build →
        </a>
        <a
          href="https://github.com/steverahardjo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[var(--muted-foreground)] no-underline hover:text-[var(--text)] transition-colors"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
