import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 8, columns = 6 }: TableSkeletonProps) {
  const widths = ["w-8", "w-28", "w-24", "w-16", "w-20", "w-6"]

  return (
    <Card className="shadow-ambient">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 border-b px-4 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton
                key={`header-${i}`}
                className={`h-3.5 ${widths[i % widths.length]}`}
              />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center gap-4 border-b px-4 py-3.5 last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton
                  key={`row-${rowIdx}-${colIdx}`}
                  className={`h-4 ${widths[colIdx % widths.length]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
