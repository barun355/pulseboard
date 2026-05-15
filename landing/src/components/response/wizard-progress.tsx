"use client"

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  label: string
}

export function WizardProgress({
  currentStep,
  totalSteps,
  label,
}: WizardProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
