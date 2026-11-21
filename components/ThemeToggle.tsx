"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Synchronize with explicit localStorage preference (defaults strictly to Light mode)
    const frameId = requestAnimationFrame(() => {
      const saved = localStorage.getItem("fixmate-theme");
      const isDark = saved === "dark";
      setTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setMounted(true);
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fixmate-theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
        if (e.newValue === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<"light" | "dark">;
      if (customEvent.detail === "light" || customEvent.detail === "dark") {
        setTheme(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("fixmate:theme-change", handleCustomChange);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("fixmate:theme-change", handleCustomChange);
    };
  }, []);

  const toggleTheme = () => {
    const isCurrentDark = document.documentElement.classList.contains("dark");
    const nextTheme = isCurrentDark ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("fixmate-theme", nextTheme);
    } catch {
      // guard against blocked storage
    }

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Broadcast change to other ThemeToggle components in the same window
    window.dispatchEvent(new CustomEvent("fixmate:theme-change", { detail: nextTheme }));
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-[#DCE5DF] bg-white/60 dark:bg-[#143230] dark:border-[#24504D]" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="theme-toggle-btn inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE5DF] bg-white text-[#0B3638] hover:bg-[#F0F4F2] hover:border-[#18756B]/40 transition-all shadow-2xs cursor-pointer focus:outline-hidden dark:bg-[#143230] dark:border-[#24504D] dark:text-[#F4B740] dark:hover:bg-[#1B4240] dark:hover:border-[#387672]"
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Color Theme"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-[#F4B740] fill-[#F4B740]/25 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-[#0B3638] fill-[#0B3638]/20 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
