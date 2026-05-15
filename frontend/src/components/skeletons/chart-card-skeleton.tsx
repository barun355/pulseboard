import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardSkeletonProps {
  height?: number
}

export function ChartCardSkeleton({ height = 300 }: ChartCardSkeletonProps) {
  return (
    <Card className="shadow-ambient">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full rounded-lg" style={{ height }} />
      </CardContent>
    </Card>
  )
}

export function PieChartSkeleton() {
  return (
    <Card className="shadow-ambient">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton className="size-44 rounded-full" />
      </CardContent>
    </Card>
  )
}
