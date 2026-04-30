import { StatsSkeleton, CardSkeleton, Skeleton } from '@/components/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton className="h-72" />
        <CardSkeleton className="h-72" />
      </div>

      <CardSkeleton />
    </div>
  )
}