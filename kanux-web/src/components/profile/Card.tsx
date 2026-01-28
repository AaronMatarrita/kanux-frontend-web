// cards to container
export function Card({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="px-6 py-5 border-b border-gray-200">
      {children}
    </div>
  );
}

export function CardContent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="relative p-6">
      {children}
    </div>
  );
}
