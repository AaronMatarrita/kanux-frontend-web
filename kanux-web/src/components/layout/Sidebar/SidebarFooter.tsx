"use client";
import { useAuth } from "@/context/AuthContext";
import { mockSession } from "@/store/session.mock";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export const SidebarFooter = () => {
  const { session, loading } = useAuth();
  const mounted = useMounted();

  const user = !mounted
    ? mockSession
    : loading
      ? mockSession
      : session
        ? {
            name:
              session.user.userType === "company"
                ? (session.user.profile.name ?? "Empresa")
                : session.user.profile.first_name +
                    " " +
                    session.user.profile.last_name || "Talento",
            email: session.user.email,
            photoUrl:
              session.user.userType === "company"
                ? session.user.profile.url_logo || null
                : session.user.profile.photo_url || null,
          }
        : mockSession;

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <button className="w-full border-t border-sidebar-border px-4 py-4 flex items-center gap-3 cursor-pointer rounded-b-xl transition-all duration-300 ease-out hover:bg-sidebar-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/40">
      <div className="relative">
        {user.photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.photoUrl}
              className="h-10 w-10 rounded-full border border-sidebar-border"
              alt={user.name || "User"}
              width={40}
              height={40}
            />
          </>
        ) : (
          <div className="h-10 w-10 rounded-full border border-sidebar-border bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-medium text-sm">
              {userInitial}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-sidebar-foreground truncate">
          {user.name || "Usuario"}
        </p>
        <p className="text-xs text-sidebar-foreground/60 truncate">
          {user.email || "usuario@example.com"}
        </p>
      </div>
    </button>
  );
};
