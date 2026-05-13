import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  MessageSquare,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { StatCard } from "@/components/analytics/stat-card"
import { ResponseTrendChart } from "@/components/analytics/response-trend-chart"
import { QuestionBreakdownCard } from "@/components/analytics/question-breakdown-card"
import { AudiencePieChart } from "@/components/analytics/audience-pie-chart"
import { SourceBarChart } from "@/components/analytics/source-bar-chart"
import { RatingDistributionChart } from "@/components/analytics/rating-distribution-chart"
import { FeedbackList } from "@/components/analytics/feedback-list"
import { ResponseHeatmap } from "@/components/analytics/response-heatmap"
import { MOCK_POLLS, MOCK_ANALYTICS } from "@/lib/mock-data"
import { formatDuration } from "@/lib/utils"
import type { PollWithCounts, PollAnalyticsData } from "@/types"

export function PollAnalytics() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const [poll, setPoll] = useState<PollWithCounts | null>(null)
  const [analytics, setAnalytics] = useState<PollAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with API call
    const found = MOCK_POLLS.find((p) => p.id === pollId) ?? null
    setPoll(found)
    setAnalytics(MOCK_ANALYTICS[pollId!] ?? null)
    setLoading(false)
  }, [pollId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-20 text-center">
        <HelpCircle className="mx-auto size-10 text-muted-foreground/50" />
        <p className="font-heading text-lg font-medium">Poll not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-20 text-center">
        <MessageSquare className="mx-auto size-10 text-muted-foreground/50" />
        <p className="font-heading text-lg font-medium">No analytics data</p>
        <p className="text-sm text-muted-foreground">
          This poll has no responses yet.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(`/polls/${pollId}`)}
        >
          Back to Poll
        </Button>
      </div>
    )
  }

  const { overview, trend, questions, audience, sources, feedback, heatmap } =
    analytics

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight truncate">
              Analytics: {poll.title}
            </h2>
            <PollStatusBadge status={poll.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {overview.totalResponses} total responses
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/polls/${pollId}`)}
        >
          <ArrowLeft className="size-3.5" />
          Back to Poll
        </Button>
      </div>

      {/* Row 1: Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          title="Total Responses"
          value={overview.totalResponses}
          icon={MessageSquare}
        />
        <StatCard
          title="Completion Rate"
          value={overview.completionRate}
          icon={CheckCircle2}
          formatValue={(v) => `${v}%`}
        />
        <StatCard
          title="Avg Time Spent"
          value={overview.avgTimeSeconds}
          icon={Clock}
          formatValue={formatDuration}
        />
        <StatCard
          title="Avg Rating"
          value={overview.avgRating}
          icon={Star}
          formatValue={(v) => v.toFixed(1)}
          subtitle="out of 5"
        />
      </div>

      {/* Row 2: Response Trend */}
      <ResponseTrendChart data={trend} />

      {/* Row 3: Question Breakdown */}
      <QuestionBreakdownCard questions={questions} />

      {/* Row 4: Audience Insights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AudiencePieChart title="Device Type" data={audience.devices} />
        <AudiencePieChart title="Browser" data={audience.browsers} />
        <AudiencePieChart title="OS Distribution" data={audience.os} />
        <AudiencePieChart title="Locale / Region" data={audience.locales} />
      </div>

      {/* Row 5: Engagement Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResponseHeatmap data={heatmap} />
        <SourceBarChart data={sources} />
      </div>

      {/* Row 6: Feedback */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RatingDistributionChart
          ratings={feedback.ratings}
          avgRating={overview.avgRating}
        />
        <FeedbackList comments={feedback.comments} />
      </div>
    </div>
  )
}
