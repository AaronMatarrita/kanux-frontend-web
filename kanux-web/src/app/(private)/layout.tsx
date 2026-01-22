"use client";

import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Botón hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A4A]/40"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* Main content area */}
      <main className="lg:ml-72 p-4 sm:p-6 lg:p-8">
        <div className="pt-12 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
