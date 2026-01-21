"use client";

import { PanelLeft } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TopbarActions } from "./TopbarActions";
import { IconButton } from "./IconButton";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white border-b border-slate-200 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Toggle Sidebar Button */}
        <IconButton
          icon={PanelLeft}
          onClick={onToggleSidebar}
          label="Toggle sidebar"
        />

        {/* Center: Search Input */}
        <SearchBar />

        {/* Right: Actions */}
        <TopbarActions />
      </div>
    </header>
  );
};
