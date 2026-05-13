import { useMemo } from "react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS } from "@/lib/chart-colors"
import type { SourceBreakdown } from "@/types"

interface SourceBarChartProps {
  data: SourceBreakdown[]
}

export function SourceBarChart({ data }: SourceBarChartProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.count, 0)
    const chartData = data.map((d) => ({
      ...d,
      pct: total > 0 ? Math.round((d.count / total) * 100) : 0,
    }))

    const chartConfig = data.reduce<ChartConfig>((acc, d, i) => {
      acc[d.source] = {
        label: d.source,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }
      return acc
    }, {})

    return { chartData, chartConfig }
  }, [data])

  const chartHeight = Math.max(200, data.length * 48)

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Response Source (UTM)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full" style={{ height: chartHeight }}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="source"
              tickLine={false}
              axisLine={false}
              width={100}
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
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
