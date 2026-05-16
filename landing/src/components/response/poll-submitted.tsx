"use client"

import { CheckCircle2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicAnalyticsView } from "./public-analytics-view"

interface PollSubmittedProps {
  canEdit?: boolean
  onEdit?: () => void
  pollId: string
  showAnalytics: boolean
}

export function PollSubmitted({ canEdit, onEdit, pollId, showAnalytics }: PollSubmittedProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <h2 className="font-heading text-xl font-semibold mb-2">
          Thank you!
        </h2>
        <p className="text-sm text-muted-foreground">
          Your response has been submitted successfully.
        </p>
        {canEdit && onEdit && (
          <Button
            variant="outline"
            className="mt-6"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Edit Response
          </Button>
        )}
      </div>

      {showAnalytics && (
        <div className="mt-10 w-full border-t border-border pt-8">
          <PublicAnalyticsView pollId={pollId} />
        </div>
      )}
    </div>
  )
}
