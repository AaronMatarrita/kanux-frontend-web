import { LucideIcon } from "lucide-react";

interface PillProps {
  icon: LucideIcon;
  text: string;
}

export function Pill({ icon: Icon, text }: PillProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="font-medium text-foreground text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
