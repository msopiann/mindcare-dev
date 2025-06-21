"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ChatThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-2 rounded p-2">
      <button
        aria-label="Set light mode"
        onClick={() => setTheme("light")}
        className={`rounded-full p-2 ${theme === "light" ? "bg-[#EEF2FF] text-[#4F46E5] dark:bg-gray-600" : ""}`}
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        aria-label="Set dark mode"
        onClick={() => setTheme("dark")}
        className={`rounded-full p-2 ${theme === "dark" ? "bg-[#EEF2FF] dark:bg-gray-600" : ""}`}
      >
        <Moon className="h-5 w-5" />
      </button>
    </div>
  );
}
