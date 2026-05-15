"use client"

import { useCallback, useRef, useState } from "react"
import type { Poll } from "@/lib/types"
import { QuestionCard } from "./question-card"
import { FeedbackSection } from "./feedback-section"
import { WizardProgress } from "./wizard-progress"
import { WizardNavigation } from "./wizard-navigation"

export interface WizardSubmitData {
  answers: Record<string, string>
  feedback: string | null
  rating: number | null
  spendTimePerQuestion: Record<string, number>
}

interface PollWizardProps {
  poll: Poll
  onSubmit: (data: WizardSubmitData) => void
  isSubmitting: boolean
  submitError: string | null
  initialData?: WizardSubmitData | null
}

export function PollWizard({
  poll,
  onSubmit,
  isSubmitting,
  submitError,
  initialData,
}: PollWizardProps) {
  const questions = [...poll.questions].sort((a, b) => a.order - b.order)
  const totalSteps = questions.length + 1 // questions + feedback

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(initialData?.answers ?? {})
  const [feedback, setFeedback] = useState(initialData?.feedback ?? "")
  const [rating, setRating] = useState<number | null>(initialData?.rating ?? null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Per-question timing
  const timePerQuestion = useRef<Record<string, number>>({})
  const stepEnteredAt = useRef(Date.now())

  const isLastStep = currentStep === totalSteps - 1
  const isFirstStep = currentStep === 0
  const isQuestionStep = currentStep < questions.length

  const currentQuestion = isQuestionStep ? questions[currentStep] : null

  const finalizeStepTime = useCallback(() => {
    if (currentStep < questions.length) {
      const questionId = questions[currentStep].id
      const elapsed = Date.now() - stepEnteredAt.current
      timePerQuestion.current[questionId] =
        (timePerQuestion.current[questionId] ?? 0) + elapsed
    }
    stepEnteredAt.current = Date.now()
  }, [currentStep, questions])

  function goNext() {
    if (currentStep >= totalSteps - 1) return
    finalizeStepTime()
    setValidationError(null)
    setCurrentStep((s) => s + 1)
  }

  function goPrev() {
    if (currentStep <= 0) return
    finalizeStepTime()
    setValidationError(null)
    setCurrentStep((s) => s - 1)
  }

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    setValidationError(null)
  }

  function handleSubmit() {
    // Validate all required questions
    const unanswered = questions.filter(
      (q) => !q.isOptional && !answers[q.id],
    )
    if (unanswered.length > 0) {
      // Navigate to the first unanswered required question
      const firstIdx = questions.findIndex((q) => q.id === unanswered[0].id)
      finalizeStepTime()
      setCurrentStep(firstIdx)
      setValidationError(
        `Please answer all required questions. (${unanswered.length} remaining)`,
      )
      return
    }

    // Finalize timing for current step
    finalizeStepTime()

    onSubmit({
      answers,
      feedback: feedback || null,
      rating,
      spendTimePerQuestion: { ...timePerQuestion.current },
    })
  }

  // Build the progress label
  const progressLabel = isQuestionStep
    ? `Question ${currentStep + 1} of ${questions.length}`
    : "Feedback"

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          {poll.title}
        </h1>
        {poll.description && (
          <p className="mt-2 text-muted-foreground">{poll.description}</p>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <WizardProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          label={progressLabel}
        />
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentQuestion ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentStep}
            selectedOptionId={answers[currentQuestion.id] || null}
            onSelect={handleSelect}
          />
        ) : (
          <FeedbackSection
            rating={rating}
            feedback={feedback}
            onRatingChange={setRating}
            onFeedbackChange={setFeedback}
          />
        )}
      </div>

      {/* Errors */}
      {(validationError || submitError) && (
        <p className="mb-4 text-sm text-destructive">
          {validationError || submitError}
        </p>
      )}

      {/* Navigation */}
      <WizardNavigation
        onPrevious={goPrev}
        onNext={goNext}
        onSubmit={handleSubmit}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
