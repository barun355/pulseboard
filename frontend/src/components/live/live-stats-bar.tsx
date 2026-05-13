import { Card, CardContent } from "@/components/ui/card"
import { ConnectionIndicator } from "./connection-indicator"

interface LiveStatsBarProps {
  totalResponses: number
  recentRate: number
  connectionStatus: "connected" | "disconnected" | "reconnecting"
}

export function LiveStatsBar({
  totalResponses,
  recentRate,
  connectionStatus,
}: LiveStatsBarProps) {
  return (
    <Card className="shadow-ambient">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Responses:</span>
          <span className="font-heading text-2xl font-semibold tabular-nums">
            {totalResponses.toLocaleString()}
          </span>
          {recentRate > 0 && (
            <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
              +{recentRate} in last min
            </span>
          )}
        </div>
        <ConnectionIndicator status={connectionStatus} />
      </CardContent>
    </Card>
  )
}
