import { Skeleton } from "./Skeleton";

export function InfoItemSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-32" /> 
      <Skeleton className="h-5 w-24" />
    </div>
  );
}
