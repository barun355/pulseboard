import { Fragment, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { HeatmapDataPoint } from "@/types"

interface ResponseHeatmapProps {
  data: HeatmapDataPoint[]
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOUR_LABELS = ["12a", "6a", "12p", "6p"]

function formatHour(h: number): string {
  if (h === 0) return "12am"
  if (h < 12) return `${h}am`
  if (h === 12) return "12pm"
  return `${h - 12}pm`
}

export function ResponseHeatmap({ data }: ResponseHeatmapProps) {
  const { grid, maxCount, peakHour } = useMemo(() => {
    const grid = new Map<string, number>()
    let maxCount = 0
    const hourTotals = new Map<number, number>()

    for (const point of data) {
      const key = `${point.day}-${point.hour}`
      grid.set(key, point.count)
      if (point.count > maxCount) maxCount = point.count

      hourTotals.set(point.hour, (hourTotals.get(point.hour) ?? 0) + point.count)
    }

    let peakHour = 0
    let peakCount = 0
    for (const [hour, total] of hourTotals) {
      if (total > peakCount) {
        peakCount = total
        peakHour = hour
      }
    }

    return { grid, maxCount, peakHour }
  }, [data])

  function getCellColor(count: number): string {
    if (maxCount === 0 || count === 0) return "var(--color-muted)"
    const intensity = count / maxCount
    const alpha = 0.15 + intensity * 0.85
    return `rgba(59, 130, 246, ${alpha})`
  }

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Response Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `36px repeat(24, 16px)` }}>
              {/* Header row - hour labels */}
              <div />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="text-center text-[9px] text-muted-foreground">
                  {h % 6 === 0 ? HOUR_LABELS[h / 6] : ""}
                </div>
              ))}

              {/* Data rows */}
              {DAY_LABELS.map((day, dayIdx) => (
                <Fragment key={dayIdx}>
                  <div className="flex items-center text-[11px] text-muted-foreground pr-1">
                    {day}
                  </div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const count = grid.get(`${dayIdx}-${hour}`) ?? 0
                    return (
                      <Tooltip key={`${dayIdx}-${hour}`}>
                        <TooltipTrigger asChild>
                          <div
                            className="size-4 rounded-[3px] transition-colors"
                            style={{ backgroundColor: getCellColor(count) }}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          {day} {formatHour(hour)}: {count} responses
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </TooltipProvider>

        <p className="text-xs text-muted-foreground">
          Peak: {formatHour(peakHour)}–{formatHour(peakHour + 2)}
        </p>
      </CardContent>
    </Card>
  )
}
