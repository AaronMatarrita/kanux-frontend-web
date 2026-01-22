"use client";

import { SIDEBAR_MENU } from "@/config/sidebar.config";
import { mockSession } from "@/store/session.mock";
import { SidebarItem } from "./SidebarItem";
import { SidebarFooter } from "./SidebarFooter";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const menuItems = SIDEBAR_MENU[mockSession.role];

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/kanux-logo-sidebar.svg" alt="Kanux" />
        </div>

        {/* Section title */}
        <div className="px-6 pt-6 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          Pages
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-3 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.route || pathname.startsWith(`${item.route}/`);

            return (
              <SidebarItem
                key={item.route}
                icon={item.icon}
                label={item.label}
                href={item.route}
                active={isActive}
              />
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 mt-auto">
          <SidebarFooter />
        </div>
      </aside>
    </>
  );
};
