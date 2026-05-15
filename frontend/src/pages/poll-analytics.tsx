import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  HelpCircle,
  MessageSquare,
  Share2,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { StatCard } from "@/components/analytics/stat-card"
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton"
import { ChartCardSkeleton, PieChartSkeleton } from "@/components/skeletons/chart-card-skeleton"
import { ResponseTrendChart } from "@/components/analytics/response-trend-chart"
import { QuestionBreakdownCard } from "@/components/analytics/question-breakdown-card"
import { AudiencePieChart } from "@/components/analytics/audience-pie-chart"
import { SourceBarChart } from "@/components/analytics/source-bar-chart"
import { RatingDistributionChart } from "@/components/analytics/rating-distribution-chart"
import { FeedbackList } from "@/components/analytics/feedback-list"
import { ResponseHeatmap } from "@/components/analytics/response-heatmap"
import { formatDuration } from "@/lib/utils"
import { pollQueries } from "@/queries/poll.queries"
import { analyticsQueries } from "@/queries/analytics.queries"

export function PollAnalytics() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const { data: poll, isLoading: pollLoading } = useQuery(pollQueries.detail(pollId!))
  const { data: analytics, isLoading: analyticsLoading } = useQuery(analyticsQueries.poll(pollId!))

  const isLoading = pollLoading || analyticsLoading

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        {/* Row 1: Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        {/* Row 2: Trend Chart */}
        <ChartCardSkeleton height={300} />
        {/* Row 3: Question Breakdown */}
        <ChartCardSkeleton height={220} />
        {/* Row 4: Audience Pie Charts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PieChartSkeleton />
          <PieChartSkeleton />
          <PieChartSkeleton />
          <PieChartSkeleton />
        </div>
        {/* Row 5: Heatmap + Source */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCardSkeleton height={200} />
          <ChartCardSkeleton height={200} />
        </div>
        {/* Row 6: Rating + Feedback */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCardSkeleton height={220} />
          <ChartCardSkeleton height={220} />
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <Empty className="mx-auto max-w-3xl py-20">
        <EmptyHeader>
          <EmptyMedia>
            <HelpCircle className="size-10 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>Poll not found</EmptyTitle>
          <EmptyDescription>
            This poll may have been deleted or the link is incorrect.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  if (!analytics) {
    return (
      <Empty className="mx-auto max-w-3xl py-20">
        <EmptyHeader>
          <EmptyMedia>
            <MessageSquare className="size-10 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>
            "You can't improve what you don't measure."
          </EmptyTitle>
          <EmptyDescription>
            Share your poll and start collecting responses. Analytics will appear here
            the moment your first response arrives.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            onClick={() => navigate(`/polls/${pollId}`)}
          >
            <Share2 className="size-3.5" />
            Go Share Your Poll
          </Button>
        </EmptyContent>
      </Empty>
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/polls/${pollId}/responses`)}
          >
            <FileSpreadsheet className="size-3.5" />
            Responses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/polls/${pollId}`)}
          >
            <ArrowLeft className="size-3.5" />
            Back to Poll
          </Button>
        </div>
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
