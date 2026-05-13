import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { FeedbackComment } from "@/types"

interface FeedbackListProps {
  comments: FeedbackComment[]
}

export function FeedbackList({ comments }: FeedbackListProps) {
  return (
    <Card className="shadow-ambient">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length > 0 ? (
          <div className="max-h-[280px] space-y-3 overflow-y-auto pr-1">
            {comments.map((comment, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          className={`size-3 ${
                            j < comment.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.submittedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-2">
                    &ldquo;{comment.text}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No feedback yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
