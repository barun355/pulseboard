import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDuration } from "@/lib/utils"
import { generateCsv, downloadCsv } from "@/lib/csv-export"
import type { ResponseDetail, QuestionWithOptions } from "@/types"

interface ResponseExpandedRowProps {
  response: ResponseDetail
  questions: QuestionWithOptions[]
  pollSlug: string
}

export function ResponseExpandedRow({
  response,
  questions,
  pollSlug,
}: ResponseExpandedRowProps) {
  const sortedAnswers = [...response.answers].sort(
    (a, b) => a.questionOrder - b.questionOrder
  )

  function handleExportSingle() {
    const csv = generateCsv([response], questions)
    const safeName = response.respondent.replace(/[^a-zA-Z0-9]/g, "-")
    downloadCsv(csv, `${pollSlug}-response-${safeName}-${response.id}.csv`)
  }

  return (
    <div className="space-y-4 rounded-lg bg-muted/30 px-4 py-3">
      {/* Answers */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Answers
        </p>
        {sortedAnswers.map((a, i) => (
          <div key={a.questionId} className="flex gap-2 text-sm">
            <span className="shrink-0 text-muted-foreground">
              Q{i + 1}: {a.questionTitle}
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            {a.optionName ? (
              <span className="font-medium">&ldquo;{a.optionName}&rdquo;</span>
            ) : (
              <span className="italic text-muted-foreground">(skipped)</span>
            )}
          </div>
        ))}
      </div>

      {/* Feedback */}
      {response.feedback && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Feedback
            </p>
            <p className="text-sm pl-2 border-l-2 border-muted-foreground/20">
              &ldquo;{response.feedback}&rdquo;
            </p>
          </div>
        </>
      )}

      {/* Metadata */}
      <Separator />
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Metadata
        </p>
        <p className="text-sm text-muted-foreground">
          {response.meta.browser} · {response.meta.os} · {response.meta.deviceType} · {response.meta.locale}
        </p>
        {response.meta.utmSource && (
          <p className="text-sm text-muted-foreground">
            Source: {response.meta.utmSource} ({response.meta.utmMedium})
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Time spent: {formatDuration(response.meta.timeSpentSeconds)}
        </p>
      </div>

      {/* Export single */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExportSingle}>
          <Download className="size-3.5" />
          Export This
        </Button>
      </div>
    </div>
  )
}
