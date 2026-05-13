import { useMemo } from "react"
import { Cell, Pie, PieChart, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS } from "@/lib/chart-colors"

interface AudiencePieChartProps {
  title: string
  data: Record<string, number>
}

export function AudiencePieChart({ title, data }: AudiencePieChartProps) {
  const { chartData, chartConfig, topLabel } = useMemo(() => {
    const entries = Object.entries(data).sort(([, a], [, b]) => b - a)
    const total = entries.reduce((sum, [, v]) => sum + v, 0)

    const chartData = entries.map(([name, value]) => ({ name, value }))

    const chartConfig = entries.reduce<ChartConfig>((acc, [name], i) => {
      acc[name] = {
        label: name,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }
      return acc
    }, {})

    const top = entries[0]
    const topPct = total > 0 ? Math.round((top[1] / total) * 100) : 0
    const topLabel = `${topPct}% ${top[0]}`

    return { chartData, chartConfig, topLabel }
  }, [data])

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto h-[240px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              animationDuration={600}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-sm font-semibold"
                        >
                          {topLabel}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
