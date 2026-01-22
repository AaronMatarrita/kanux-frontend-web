import { mockSession } from "@/store/session.mock";

export const SidebarFooter = () => {
  const { name, email, photoUrl } = mockSession;
  const userInitial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <button className="w-full border-t border-slate-200 px-4 py-4 flex items-center gap-3 cursor-pointer rounded-b-xl transition-all duration-300 ease-out hover:bg-slate-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A4A]/40">
      <div className="relative">
        {photoUrl ? (
          <img
            src={photoUrl}
            className="h-10 w-10 rounded-full border border-slate-200"
            alt={name || "User"}
          />
        ) : (
          <div className="h-10 w-10 rounded-full border border-slate-200 bg-[#0B2A4A] flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {userInitial}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {name || "Usuario"}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {email || "usuario@example.com"}
        </p>
      </div>
    </button>
  );
};
