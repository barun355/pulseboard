import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CHART_COLORS } from "@/lib/chart-colors"
import { cn } from "@/lib/utils"
import type { LiveQuestionState } from "@/types"

interface LiveQuestionBreakdownProps {
  questions: LiveQuestionState[]
}

export function LiveQuestionBreakdown({ questions }: LiveQuestionBreakdownProps) {
  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Live Question Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((question, qIdx) => (
          <div key={question.questionId}>
            {qIdx > 0 && <Separator className="mb-5" />}
            <p className="mb-3 text-sm font-medium">
              Q{qIdx + 1}: &ldquo;{question.title}&rdquo;
            </p>
            <div className="space-y-2.5">
              {question.options.map((option, oIdx) => {
                const pct =
                  question.totalResponses > 0
                    ? Math.round(
                        (option.count / question.totalResponses) * 100
                      )
                    : 0

                return (
                  <OptionBar
                    key={option.optionId}
                    name={option.name}
                    count={option.count}
                    pct={pct}
                    color={CHART_COLORS[oIdx % CHART_COLORS.length]}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function OptionBar({
  name,
  count,
  pct,
  color,
}: {
  name: string
  count: number
  pct: number
  color: string
}) {
  const prevCountRef = useRef(count)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (count > prevCountRef.current) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 500)
      prevCountRef.current = count
      return () => clearTimeout(timer)
    }
    prevCountRef.current = count
  }, [count])

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{name}</span>
        <span className={cn("tabular-nums font-medium", flash && "text-foreground")}>
          {pct}% ({count})
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            flash && "brightness-125"
          )}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
