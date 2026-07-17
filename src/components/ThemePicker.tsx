import { useState, useEffect, useRef } from "react";

const themes = [
  {
    id: "original",
    label: "Original",
    color: "#a41c1a",
    description: "Warm earth tones",
  },
  {
    id: "tokyo-midnight",
    label: "Tokyo Midnight",
    color: "#4f8fff",
    description: "Deep indigo & neon blue",
  },
  {
    id: "quartz",
    label: "Quartz",
    color: "#f472b6",
    description: "Rose quartz & plum",
  },
  {
    id: "emerald",
    label: "Emerald",
    color: "#34d399",
    description: "Forest green & teal",
  },
] as const;

const gradientColors = themes.map((t) => t.color).join(", ");

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("original");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme-palette");
    if (stored && themes.some((t) => t.id === stored)) {
      setActive(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "original");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const select = (id: string) => {
    setActive(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme-palette", id);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity" />
      )}

      <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
        {open && (
          <div
            className="absolute bottom-16 right-0 w-56 rounded-xl border shadow-lg overflow-hidden transition-all duration-200"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border-b"
              style={{
                color: "var(--muted-foreground)",
                borderColor: "var(--border)",
              }}
            >
              Palette
            </div>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => select(t.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:brightness-110"
                style={{
                  background:
                    active === t.id
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "transparent",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 ring-1 ring-offset-1"
                  style={{
                    backgroundColor: t.color,
                    boxShadow: `0 0 8px ${t.color}40`,
                    borderColor: active === t.id ? t.color : "transparent",
                    borderWidth: active === t.id ? "2px" : "0",
                  }}
                />
                <div className="flex flex-col items-start text-left">
                  <span
                    className="font-medium text-sm leading-tight"
                    style={{ color: "var(--text)" }}
                  >
                    {t.label}
                  </span>
                  <span
                    className="text-[11px] leading-tight"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="w-11 h-11 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: `conic-gradient(from 0deg, ${gradientColors})`,
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
          aria-label="Switch theme palette"
        />
      </div>
    </>
  );
}
