"use client"

import { CheckCircle2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PollSubmittedProps {
  canEdit?: boolean
  onEdit?: () => void
}

export function PollSubmitted({ canEdit, onEdit }: PollSubmittedProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm text-center">
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
    </div>
  )
}
