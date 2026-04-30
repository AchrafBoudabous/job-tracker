import { CardSkeleton, Skeleton } from '@/components/Skeleton'

export default function ApplicationDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>

      <CardSkeleton className="h-96" />
      <CardSkeleton className="h-48" />
      <CardSkeleton className="h-48" />
      <CardSkeleton className="h-48" />
    </div>
  )
}