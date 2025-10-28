import { useEffect, useState } from "react";
type Theme = 'light' | 'dark';

export default function useDarkMode() {
  const [theme, setTheme] = useState<Theme | undefined>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") as Theme || "light";
    }
    return undefined;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = storedTheme || 'light';
    
    setTheme(initialTheme);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === undefined) return; 

    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme, mounted };
}