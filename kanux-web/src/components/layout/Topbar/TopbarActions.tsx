"use client";

import { Sun, Moon, LogOut } from "lucide-react";
import { IconButton } from "./IconButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "kanux-theme";

export const TopbarActions = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("light");

  const applyTheme = (nextTheme: ThemeMode) => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme: ThemeMode =
      stored === "dark" || stored === "light"
        ? stored
        : prefersDark
          ? "dark"
          : "light";
    applyTheme(initialTheme);
  }, []);

  const handleThemeToggle = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton
        icon={theme === "dark" ? Sun : Moon}
        onClick={handleThemeToggle}
        label="Toggle theme"
      />
      <IconButton icon={LogOut} onClick={handleLogout} label="Logout" />
    </div>
  );
};
