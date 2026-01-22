"use client";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Topbar } from "@/components/layout/Topbar/Topbar";
import { useState } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main content area */}
      <main
        className={`mt-16 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
