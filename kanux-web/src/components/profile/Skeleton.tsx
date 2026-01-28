export function Skeleton({ 
  className = "" 
}: { 
  className?: string 
}) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// Specific skeleton
export function SkeletonText({ 
  lines = 1,
  className = ""
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ 
  className = "" 
}: { 
  className?: string 
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <Skeleton className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonAvatar({ 
  size = "md" 
}: { 
  size?: "sm" | "md" | "lg" 
}) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <Skeleton className={`${sizes[size]} rounded-full`} />
  );
}

export function SkeletonBadge() {
  return (
    <Skeleton className="h-9 w-24 rounded-full" />
  );
}
