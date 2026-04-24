export function Skeleton({ className = '' }) {
  return <div className={`bg-[#1a2235] animate-pulse rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-[#171b28] border border-[#313442] rounded-xl p-4 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-3 w-6" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
      <div className="h-px bg-[#313442] mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}
