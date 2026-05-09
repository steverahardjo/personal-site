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
    <div class="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/30">
      <div class="p-5 sm:p-6">
        <div class="flex items-center gap-2 mb-1">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span class="text-[10px] font-bold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
            In Progress
          </span>
        </div>

        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-base sm:text-lg font-bold tracking-tight text-[var(--text)]">
              Deneb
            </h3>
            <p class="text-xs text-[var(--muted-foreground)]">
              Full-stack expense tracking platform
            </p>
          </div>
          <div class="flex -space-x-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-[var(--accent)]/10 text-[var(--accent)]">
              React
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600">
              Go
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-600">
              AI
            </span>
          </div>
        </div>

        <p class="text-xs leading-relaxed text-[var(--muted-foreground)] mb-4">
          A modular expense tracker with a Go backend, React frontend, and
          multi-agent AI system for receipt scanning, categorization, and
          financial insights.
        </p>

        <div class="flex flex-col gap-1.5">
          {features.map((f) => (
            <div class="flex items-center gap-2.5 text-xs">
              <span
                class={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  f.done
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-[var(--border)] text-[var(--muted-foreground)]"
                }`}
              >
                {f.done ? (
                  <svg
                    class="w-2.5 h-2.5"
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
                    class="w-2.5 h-2.5"
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
                class={`${f.done ? "text-[var(--text)]" : "text-[var(--muted-foreground)]"}`}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div class="border-t border-[var(--border)] px-5 sm:px-6 py-3 flex items-center justify-between">
        <a
          href="/writing"
          class="text-[11px] font-medium text-[var(--accent)] no-underline hover:underline underline-offset-2 transition-all"
        >
          Read about the build →
        </a>
        <a
          href="https://github.com/steverahardjo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[11px] text-[var(--muted-foreground)] no-underline hover:text-[var(--text)] transition-colors"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
