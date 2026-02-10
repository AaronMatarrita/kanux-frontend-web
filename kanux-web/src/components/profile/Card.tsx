// cards to container
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5 border-b border-border">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="relative p-6">{children}</div>;
}
