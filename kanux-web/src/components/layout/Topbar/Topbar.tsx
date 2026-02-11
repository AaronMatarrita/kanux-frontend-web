"use client";

import { PanelLeft } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TopbarActions } from "./TopbarActions";
import { IconButton } from "./IconButton";
import { SearchModal } from "./SearchModal";
import { useState } from "react";

interface TopbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Topbar = ({ onToggleSidebar, isSidebarOpen }: TopbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-16 bg-sidebar border-b border-border backdrop-blur z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "left-0 lg:left-72" : "left-0"
        }`}
      >
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Toggle Sidebar Button */}
          <IconButton
            icon={PanelLeft}
            onClick={onToggleSidebar}
            label="Toggle sidebar"
          />

          {/* Center: Search Input */}
          <SearchBar onOpenSearch={openSearch} />

          {/* Right: Actions */}
          <TopbarActions />
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};
