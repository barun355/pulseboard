import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PollCardSkeleton() {
  return (
    <Card className="shadow-ambient">
      <CardContent className="space-y-3">
        {/* Row 1: Title + badge */}
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        {/* Row 2: Description */}
        <Skeleton className="h-4 w-3/4" />
        {/* Row 3: Metadata + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="size-7 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
