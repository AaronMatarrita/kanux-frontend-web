import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MessagesPanelProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}

export function MessagesPanel({
  children,
  isVisible,
  className,
}: MessagesPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-r border-gray-200 last:border-r-0 transition-all duration-200 ease-in-out",
        isVisible ? "flex" : "hidden md:flex",
        className,
      )}
    >
      {children}
    </div>
  );
}
