import { Avatar } from "./Avatar";
import { ContactInfo } from "./ContactInfo";
import { Button } from "./Button";
import { Contact } from "lucide-react";

export function ProfileHeader({ name, title, email, location, contact, avatar, children }: {
  name: string;
  title: string;
  email: string;
  location: string;
  contact: Record<string, unknown>|undefined;
  avatar: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Avatar src={avatar} alt={name} size="xxlg" />

      <div className="flex-1 mt-auto mb-auto">
        <h1 className="text-wrap text-2xl font-bold text-gray-900">{name}</h1>
        <p className="text-wrap text-sm text-gray-600 mb-3">{title}</p>

        {contact && Object.entries(contact).map(([key, value]) => (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Contact className="w-4 h-4" />
              <span >{key}:</span>
              <span >{String(value)}</span>
            </div>
          </div>
        ))}

      </div>
      {children}
    </div>
  );
}
