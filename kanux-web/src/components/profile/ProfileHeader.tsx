import { Avatar } from "./Avatar";
import { Contact } from "lucide-react";
import { ProfileProgressBar } from "./ProfileProgressCompletness";

export function ProfileHeader({
  name,
  title,
  email,
  location,
  contact,
  avatar,
  children,
  progress,
}: {
  name: string;
  title: string;
  email: string;
  location: string;
  contact: Record<string, unknown> | undefined;
  avatar: string | null | undefined;
  children?: React.ReactNode;
  progress: number;
}) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  console.log(initials,avatar)
  return (
    <div className="flex flex-wrap items-start gap-4">
      {!avatar || avatar === "" || avatar === "null" || avatar === "undefined"? (
        <div className="w-50 h-50 rounded-full bg-linear-to-br from-sky-600 to-emerald-500 text-white flex items-center justify-center text-9xl font-semibold shadow-md">
          {initials}
        </div>
      ) : (
        <Avatar src={avatar} alt={name} size="xxlg" />
      )}

      <div className="flex-1 mt-auto mb-auto">
        <h1 className="text-wrap text-2xl font-bold text-foreground">{name}</h1>
        <p className="text-wrap text-sm text-muted-foreground mb-3">{title}</p>

        {contact &&
          Object.entries(contact).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-wrap gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <Contact className="w-4 h-4" />
                <span>{key}:</span>
                <span>{String(value)}</span>
              </div>
            </div>
          ))}
      </div>
      <ProfileProgressBar percentage={progress} />
      {children}
    </div>
  );
}
