import { SkeletonAvatar, Skeleton, SkeletonText } from "./Skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-start gap-4">
      {/* Avatar skeleton */}
      <SkeletonAvatar size="lg" />
      
      {/* Info skeleton */}
      <div className="flex-1 space-y-3">
        <Skeleton className="h-8 w-48" /> {/* Name */}
        <Skeleton className="h-5 w-32" /> {/* Title */}
        
        {/* Contact info skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  );
}
