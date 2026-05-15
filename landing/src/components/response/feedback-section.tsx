"use client"

import { Star } from "lucide-react"

interface FeedbackSectionProps {
  rating: number | null
  feedback: string
  onRatingChange: (rating: number) => void
  onFeedbackChange: (feedback: string) => void
}

export function FeedbackSection({
  rating,
  feedback,
  onRatingChange,
  onFeedbackChange,
}: FeedbackSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-ambient">
      <h3 className="font-heading text-base font-semibold mb-1">
        Feedback
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        How was your experience? (optional)
      </p>

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onRatingChange(value)}
            className="cursor-pointer p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`size-6 ${
                rating !== null && value <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
        {rating !== null && (
          <span className="ml-2 text-sm text-muted-foreground">
            {rating}/5
          </span>
        )}
      </div>

      <textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder="Share your thoughts..."
        rows={3}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
      />
    </div>
  )
}
