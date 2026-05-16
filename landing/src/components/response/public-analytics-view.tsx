"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { BarChart3, Users, CheckCircle2, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { PublicAnalytics } from "@/lib/types"

interface PublicAnalyticsViewProps {
  pollId: string
}

export function PublicAnalyticsView({ pollId }: PublicAnalyticsViewProps) {
  const { getToken, isSignedIn } = useAuth()
  const [data, setData] = useState<PublicAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = isSignedIn ? await getToken() : null
        const result = await apiClient<PublicAnalytics>(
          `/submit/${pollId}/analytics`,
          {},
          token,
        )
        setData(result)
      } catch {
        setError("Unable to load analytics.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [pollId, getToken, isSignedIn])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <p className="text-center text-sm text-muted-foreground py-4">{error}</p>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BarChart3 className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Poll Results
          </h3>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Users className="size-4 mx-auto mb-1.5 text-blue-500" />
          <div className="text-2xl font-bold text-foreground">
            {data.overview.totalResponses}
          </div>
          <div className="text-xs text-muted-foreground">Total Responses</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CheckCircle2 className="size-4 mx-auto mb-1.5 text-green-500" />
          <div className="text-2xl font-bold text-foreground">
            {data.overview.completionRate}%
          </div>
          <div className="text-xs text-muted-foreground">Completion Rate</div>
        </div>
      </div>

      {/* Question breakdowns */}
      <div className="space-y-4">
        {data.questions.map((q, idx) => (
          <div
            key={q.questionId}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="text-sm font-medium text-foreground mb-3">
              {idx + 1}. {q.title}
            </div>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <div key={opt.optionId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{opt.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {opt.count} ({opt.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${opt.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {q.totalResponses > 0 && (
              <div className="mt-2 text-[11px] text-muted-foreground">
                {q.totalResponses} response{q.totalResponses !== 1 ? "s" : ""}
                {q.skipCount > 0 && ` · ${q.skipCount} skipped`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
