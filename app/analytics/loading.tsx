import { StatsSkeleton, CardSkeleton, Skeleton } from '@/components/Skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-60" />
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CardSkeleton className="h-36" />
        <CardSkeleton className="h-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton className="h-72" />
        <CardSkeleton className="h-72" />
      </div>
    </div>
  )
}