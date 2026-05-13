import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LiveResponseEvent } from "@/types"

interface SubmissionFeedProps {
  items: LiveResponseEvent[]
}

export function SubmissionFeed({ items }: SubmissionFeedProps) {
  const [, setTick] = useState(0)

  // Force re-render every 30s to update relative timestamps
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
            {items.map((item, i) => {
              const isComplete =
                item.questionsAnswered === item.totalQuestions

              return (
                <div
                  key={item.submissionId}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    i === 0 && "animate-[slideIn_300ms_ease-out] bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      isComplete ? "bg-green-500" : "bg-yellow-500"
                    )}
                  />
                  <span className="truncate font-medium">
                    {item.respondent}
                  </span>
                  <span className="shrink-0 text-muted-foreground">·</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.submittedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="shrink-0 text-muted-foreground">·</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.questionsAnswered} of {item.totalQuestions} answered
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Waiting for submissions...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
