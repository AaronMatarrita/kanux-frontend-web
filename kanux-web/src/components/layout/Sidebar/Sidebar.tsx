"use client";

import { SIDEBAR_MENU } from "@/config/sidebar.config";
import { mockSession } from "@/store/session.mock";
import { SidebarItem } from "./SidebarItem";
import { SidebarFooter } from "./SidebarFooter";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { mapUserTypeToRole } from "@/helper/mapper";
import { useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { session } = useAuth();
  const isClient = useIsClient();
  const [isDark, setIsDark] = useState(false);

  const role = !isClient
    ? mockSession.role
    : session
      ? mapUserTypeToRole(session.user.userType)
      : mockSession.role;

  const menuItems = SIDEBAR_MENU[role];

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    const handleOverflow = () => {
      if (window.innerWidth < 1024) {
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "unset";
        }
      } else {
        document.body.style.overflow = "unset";
      }
    };

    handleOverflow();
    window.addEventListener("resize", handleOverflow);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("resize", handleOverflow);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;
    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, [isClient]);

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
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              isDark
                ? "/brand/kanux-logo-variant-white.svg"
                : "/brand/kanux-logo-sidebar.svg"
            }
            alt="Kanux"
          />
        </div>

        {/* Section title */}
        <div className="px-6 pt-6 pb-2 text-xs font-semibold tracking-wide text-sidebar-foreground/60 uppercase">
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
