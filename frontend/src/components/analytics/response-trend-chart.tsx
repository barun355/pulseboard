import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { TrendDataPoint } from "@/types"

interface ResponseTrendChartProps {
  data: TrendDataPoint[]
}

const chartConfig = {
  count: {
    label: "Responses",
    color: "#3B82F6",
  },
} satisfies ChartConfig

export function ResponseTrendChart({ data }: ResponseTrendChartProps) {
  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Responses Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => format(parseISO(value), "MMM d")}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    format(parseISO(String(value)), "MMM d, yyyy")
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#fillCount)"
              animationDuration={800}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
