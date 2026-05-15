import { useState } from "react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { CHART_COLORS } from "@/lib/chart-colors"
import type { QuestionBreakdown } from "@/types"

interface QuestionBreakdownCardProps {
  questions: QuestionBreakdown[]
}

export function QuestionBreakdownCard({ questions }: QuestionBreakdownCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const active = questions[selectedIndex]

  const chartConfig = active.options.reduce<ChartConfig>((acc, opt, i) => {
    acc[opt.name] = {
      label: opt.name,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }
    return acc
  }, {})

  const chartHeight = Math.max(200, active.options.length * 52)

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <div className="flex md:flex-row flex-col md:items-center items-start gap-2">
          <Select
            value={String(selectedIndex)}
            onValueChange={(v) => setSelectedIndex(Number(v))}
          >
            <SelectTrigger className="w-full md:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {questions.map((q, i) => (
                <SelectItem key={q.questionId} value={String(i)}>
                  Q{i + 1}: {q.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="shrink-0 text-sm text-muted-foreground">
            {active.totalResponses} responses
            {active.skipCount > 0 && ` · ${active.skipCount} skipped`}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          key={active.questionId}
          config={chartConfig}
          className="w-full"
          style={{ height: chartHeight }}
        >
          <BarChart
            data={active.options}
            layout="vertical"
            margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={140}
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
              animationDuration={500}
              animationEasing="ease-out"
              label={(props: any) => {
                const { x, y, width, height, value, index } = props
                const pct = active.options[index]?.pct ?? 0
                return (
                  <text
                    x={x + width + 6}
                    y={y + height / 2}
                    dominantBaseline="middle"
                    fontSize={12}
                    className="fill-muted-foreground"
                  >
                    {pct}% ({value})
                  </text>
                )
              }}
            >
              {active.options.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
