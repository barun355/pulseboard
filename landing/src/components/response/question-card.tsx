"use client"

import type { Question } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  index: number
  selectedOptionId: string | null
  onSelect: (questionId: string, optionId: string) => void
}

export function QuestionCard({
  question,
  index,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-ambient">
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Q{index + 1}
          </span>
          <div className="flex-1">
            <h3 className="font-heading text-base font-semibold">
              {question.title}
            </h3>
            {question.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {question.description}
              </p>
            )}
          </div>
          {question.isOptional && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Optional
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 pl-7">
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                selectedOptionId === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => onSelect(question.id, option.id)}
                className="size-4 accent-primary"
              />
              <span className="text-sm">{option.name}</span>
            </label>
          ))}
      </div>
    </div>
  )
}
