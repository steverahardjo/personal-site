import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";

const darkThemes = new Set(["tokyo-midnight", "quartz", "emerald"]);

export default function GhCalendar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const getTheme = () => {
      const theme = html.getAttribute("data-theme") || "original";
      setIsDark(darkThemes.has(theme));
    };
    getTheme();

    const observer = new MutationObserver(() => getTheme());
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="p-6 rounded-xl border border-[var(--border)]"
      style={{
        background: "var(--surface)",
        transition: "all 0.3s ease",
      }}
    >
      <GitHubCalendar
        username="steverahardjo"
        blockSize={14}
        blockRadius={3}
        fontSize={15}
        theme={{
          light: ["#f4efe8", "#d4dcc8", "#a9c09a", "#7ea46c", "#53883e"],
          dark: ["#272320", "#1a3a1a", "#2a552a", "#3a703a", "#4a8b4a"],
        }}
        colorScheme={isDark ? "dark" : "light"}
      />
    </section>
  );
}
