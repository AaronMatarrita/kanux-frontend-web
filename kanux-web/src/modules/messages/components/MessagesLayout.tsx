import { ReactNode } from "react";

interface MessagesLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function MessagesLayout({ children, header }: MessagesLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {header && <div className="shrink-0 mb-6">{header}</div>}
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
