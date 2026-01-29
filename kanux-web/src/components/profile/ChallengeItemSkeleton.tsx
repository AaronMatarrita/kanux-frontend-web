import { Skeleton } from "./Skeleton";

export function ChallengeItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-gray-200 last:border-b-0">
      {/* Trophy Icon skeleton */}
      <Skeleton className="w-12 h-12 rounded-lg" />

      {/* Challenge Info skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-48" /> 
        <Skeleton className="h-4 w-24" /> 
      </div>

      {/* Badges skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-24 rounded-md" /> 
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}
