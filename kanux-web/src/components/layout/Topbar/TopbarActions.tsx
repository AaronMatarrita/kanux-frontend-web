"use client";

import { Sun, LogOut } from "lucide-react";
import { IconButton } from "./IconButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const TopbarActions = () => {
  const {logout,session} = useAuth();
  const router = useRouter();

  const handleThemeToggle = () => {
    // TODO: Implement theme toggle logic in a future task
    console.log("Theme toggle clicked");
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton icon={Sun} onClick={handleThemeToggle} label="Toggle theme" />
      <IconButton icon={LogOut} onClick={handleLogout} label="Logout" />
    </div>
  );
};
