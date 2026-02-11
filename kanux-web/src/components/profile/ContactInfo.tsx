import { Mail, MapPin, Phone } from "lucide-react";

export function ContactInfo({
  email,
  location,
  phone,
}: {
  email: string;
  location: string;
  phone: string;
}) {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4" />
        <span>{location}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Mail className="w-4 h-4" />
        <span>{email}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Phone className="w-4 h-4" />
        <span>{phone}</span>
      </div>
    </div>
  );
}
