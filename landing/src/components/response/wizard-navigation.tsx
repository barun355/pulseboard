"use client"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WizardNavigationProps {
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitting: boolean
}

export function WizardNavigation({
  onPrevious,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  isSubmitting,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      {isLastStep ? (
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  )
}
