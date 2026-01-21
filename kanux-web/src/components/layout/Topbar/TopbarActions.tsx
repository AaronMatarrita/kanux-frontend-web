"use client";

import { Sun, LogOut } from "lucide-react";
import { IconButton } from "./IconButton";

export const TopbarActions = () => {
  const handleThemeToggle = () => {
    // TODO: Implement theme toggle logic in a future task
    console.log("Theme toggle clicked");
  };

  const handleLogout = () => {
    // TODO: Implement logout logic in a future task
    console.log("Logout clicked");
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton icon={Sun} onClick={handleThemeToggle} label="Toggle theme" />
      <IconButton icon={LogOut} onClick={handleLogout} label="Logout" />
    </div>
  );
};
