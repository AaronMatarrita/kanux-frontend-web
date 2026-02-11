import { Edit } from "lucide-react";

interface ButtonEditProps {
  onExecute: () => void;
  label?: string;
}

export function ButtonEdit({
  onExecute,
  label = "Edit Profile",
}: ButtonEditProps) {
  return (
    <button
      onClick={onExecute} // click event
      className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors border border-border"
    >
      <Edit className="w-4 h-4" />
      {label}
    </button>
  );
}
