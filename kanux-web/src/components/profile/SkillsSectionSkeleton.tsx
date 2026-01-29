import { Skeleton, SkeletonBadge } from "./Skeleton";

export function SkillsSectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-20" />
      <div className="flex flex-wrap gap-2">
        <SkeletonBadge />
        <SkeletonBadge />
        <SkeletonBadge />
        <SkeletonBadge />
      </div>
    </div>
  );
}
