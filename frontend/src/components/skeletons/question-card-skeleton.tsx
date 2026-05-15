import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuestionCardSkeleton() {
  return (
    <Card className="shadow-ambient">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Skeleton className="mt-0.5 h-4 w-5 shrink-0" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 pl-5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3.5 w-18" />
        </div>
      </CardContent>
    </Card>
  )
}
