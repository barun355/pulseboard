import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useCountUp } from "@/hooks/use-count-up"

interface StatCardProps {
  title: string
  value: number
  subtitle?: string
  icon: LucideIcon
  formatValue?: (value: number) => string
}

export function StatCard({ title, value, subtitle, icon: Icon, formatValue }: StatCardProps) {
  const animatedValue = useCountUp(value)

  return (
    <Card className="shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <CardContent className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-heading text-3xl font-semibold tracking-tight">
            {formatValue ? formatValue(animatedValue) : animatedValue.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="rounded-lg bg-muted p-2.5">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
