import { useMemo } from "react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { RATING_COLORS } from "@/lib/chart-colors"

interface RatingDistributionChartProps {
  ratings: Record<string, number>
  avgRating: number
}

export function RatingDistributionChart({
  ratings,
  avgRating,
}: RatingDistributionChartProps) {
  const { chartData, total, chartConfig } = useMemo(() => {
    const total = Object.values(ratings).reduce((s, v) => s + v, 0)
    const chartData = [5, 4, 3, 2, 1].map((star) => ({
      star: `${star}`,
      label: `${star}★`,
      count: ratings[String(star)] ?? 0,
      pct: total > 0 ? Math.round(((ratings[String(star)] ?? 0) / total) * 100) : 0,
    }))

    const chartConfig: ChartConfig = {}
    for (let i = 1; i <= 5; i++) {
      chartConfig[String(i)] = { label: `${i}★`, color: RATING_COLORS[i] }
    }

    return { chartData, total, chartConfig }
  }, [ratings])

  const fullStars = Math.floor(avgRating)
  const hasHalf = avgRating - fullStars >= 0.5

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fontSize: 13 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => (
                    <span className="font-medium">
                      {value} ({item.payload.pct}%)
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="count"
              radius={[0, 6, 6, 0]}
              animationDuration={600}
              label={({ x, y, width, height, index }: { x: number; y: number; width: number; height: number; index: number }) => {
                const pct = chartData[index]?.pct ?? 0
                return (
                  <text
                    x={x + width + 6}
                    y={y + height / 2}
                    dominantBaseline="middle"
                    fontSize={12}
                    className="fill-muted-foreground"
                  >
                    {pct}%
                  </text>
                )
              }}
            >
              {chartData.map((d) => (
                <Cell key={d.star} fill={RATING_COLORS[Number(d.star)]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Avg: {avgRating.toFixed(1)}</span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < fullStars
                    ? "fill-yellow-400 text-yellow-400"
                    : i === fullStars && hasHalf
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "text-muted-foreground/30"
                }`}
              />
            ))}
          </span>
          <span className="text-muted-foreground">({total} ratings)</span>
        </div>
      </CardContent>
    </Card>
  )
}
