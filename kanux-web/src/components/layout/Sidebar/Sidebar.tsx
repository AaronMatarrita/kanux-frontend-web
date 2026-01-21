import { SIDEBAR_MENU } from "@/config/sidebar.config";
import { mockSession } from "@/store/session.mock";
import { SidebarItem } from "./SidebarItem";
import { SidebarFooter } from "./SidebarFooter";

export const Sidebar = () => {
  const menuItems = SIDEBAR_MENU[mockSession.role];

  return (
    <aside
      className="
        fixed left-0 top-0 z-40
        h-screen w-72
        bg-white
        border-r border-slate-200
        flex flex-col
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <img src="/brand/kanux-logo-sidebar.svg" alt="Kanux" />
      </div>

      {/* Section title */}
      <div className="px-6 pt-6 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Pages
      </div>

      {/* Navigation */}
      <nav
        className="
          flex flex-col gap-2 px-3
          overflow-y-auto
        "
      >
        {menuItems.map((item) => (
          <SidebarItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            href={item.route}
          />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="px-3 pb-4">
        <SidebarFooter />
      </div>
    </aside>
  );
};
