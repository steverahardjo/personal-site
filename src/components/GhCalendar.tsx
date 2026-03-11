import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";

export default function GhCalendar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const theme = html.getAttribute("data-theme");
      setIsDark(theme === "dark");
    });

    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        padding: "1.5rem",
        background: isDark ? "#161b22" : "#ffffff",
        borderRadius: "12px",
        border: isDark ? "1px solid #30363d" : "1px solid #e0e0e0",
        transition: "all 0.3s ease",
      }}
    >
      <GitHubCalendar
        username="steverahardjo"
        blockSize={12}
        blockRadius={3}
        fontSize={14}
        style={{ filter: isDark ? "none" : "none" }}
        theme={{
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        colorScheme={isDark ? "dark" : "light"}
      />
    </section>
  );
}
