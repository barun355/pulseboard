import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, HelpCircle, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton"
import { ChartCardSkeleton } from "@/components/skeletons/chart-card-skeleton"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { LiveStatsBar } from "@/components/live/live-stats-bar"
import { LiveTrendChart } from "@/components/live/live-trend-chart"
import { LiveQuestionBreakdown } from "@/components/live/live-question-breakdown"
import { SubmissionFeed } from "@/components/live/submission-feed"
import { usePollSocket } from "@/hooks/use-poll-socket"
import { pollQueries } from "@/queries/poll.queries"
import { analyticsQueries } from "@/queries/analytics.queries"
import type {
  LiveResponseEvent,
  LiveQuestionState,
  LiveTrendPoint,
  QuestionWithOptions,
} from "@/types"

const MAX_TREND_POINTS = 30
const MAX_FEED_ITEMS = 50

export function PollLive() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const { data: poll, isLoading: pollLoading } = useQuery(pollQueries.detail(pollId!))
  const { data: analytics, isLoading: analyticsLoading } = useQuery(analyticsQueries.poll(pollId!))

  const questions: QuestionWithOptions[] = useMemo(
    () => (poll?.questions ?? []).sort((a, b) => a.order - b.order),
    [poll],
  )
  const loading = pollLoading || analyticsLoading
  const initializedRef = useRef(false)

  // Live state
  const [totalResponses, setTotalResponses] = useState(0)
  const [recentRate, setRecentRate] = useState(0)
  const [questionStates, setQuestionStates] = useState<LiveQuestionState[]>([])
  const [trendData, setTrendData] = useState<LiveTrendPoint[]>([])
  const [feed, setFeed] = useState<LiveResponseEvent[]>([])

  const recentTimestamps = useRef<number[]>([])

  // Seed live state from query data once loaded
  useEffect(() => {
    if (initializedRef.current || loading) return
    initializedRef.current = true

    if (analytics) {
      setTotalResponses(analytics.overview.totalResponses)
      setQuestionStates(
        analytics.questions.map((q) => ({
          questionId: q.questionId,
          title: q.title,
          options: q.options.map((o) => ({
            optionId: o.optionId,
            name: o.name,
            count: o.count,
          })),
          totalResponses: q.totalResponses,
        }))
      )
      setTrendData([
        {
          time: format(new Date(), "HH:mm"),
          count: analytics.overview.totalResponses,
        },
      ])
    } else {
      setQuestionStates(
        questions.map((q) => ({
          questionId: q.id,
          title: q.title,
          options: q.options
            .sort((a, b) => a.order - b.order)
            .map((o) => ({ optionId: o.id, name: o.name, count: 0 })),
          totalResponses: 0,
        }))
      )
    }
  }, [loading, analytics, questions])

  // Rate calculation interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      recentTimestamps.current = recentTimestamps.current.filter(
        (t) => now - t < 60_000
      )
      setRecentRate(recentTimestamps.current.length)
    }, 5_000)
    return () => clearInterval(interval)
  }, [])

  const handleNewResponse = useCallback((event: LiveResponseEvent) => {
    // Increment total
    setTotalResponses((prev) => prev + 1)

    // Track timestamp for rate
    recentTimestamps.current.push(Date.now())

    // Update question breakdowns
    setQuestionStates((prev) =>
      prev.map((qs) => {
        const answer = event.answers.find(
          (a) => a.questionId === qs.questionId
        )
        if (!answer || !answer.optionId) return qs

        return {
          ...qs,
          totalResponses: qs.totalResponses + 1,
          options: qs.options.map((o) =>
            o.optionId === answer.optionId
              ? { ...o, count: o.count + 1 }
              : o
          ),
        }
      })
    )

    // Update trend
    setTrendData((prev) => {
      const currentTime = format(new Date(), "HH:mm")
      const updated = [...prev]
      const last = updated[updated.length - 1]

      if (last && last.time === currentTime) {
        updated[updated.length - 1] = {
          ...last,
          count: last.count + 1,
        }
      } else {
        const prevCount = last ? last.count : 0
        updated.push({ time: currentTime, count: prevCount + 1 })
      }

      if (updated.length > MAX_TREND_POINTS) {
        return updated.slice(updated.length - MAX_TREND_POINTS)
      }
      return updated
    })

    // Prepend to feed
    setFeed((prev) => [event, ...prev].slice(0, MAX_FEED_ITEMS))
  }, [])

  const { connectionStatus } = usePollSocket({
    pollId: pollId!,
    questions,
    onNewResponse: handleNewResponse,
  })

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        {/* Stats Bar */}
        <Card className="shadow-ambient">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
            <Skeleton className="size-3 rounded-full" />
          </CardContent>
        </Card>
        {/* Trend Chart */}
        <ChartCardSkeleton height={250} />
        {/* Feed */}
        <Card className="shadow-ambient">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Question Breakdown */}
        <ChartCardSkeleton height={200} />
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

  if (poll.status !== "PUBLISHED") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-20 text-center">
        <Radio className="mx-auto size-10 text-muted-foreground/50" />
        <p className="font-heading text-lg font-medium">
          This poll is not live
        </p>
        <p className="text-sm text-muted-foreground">
          Only published polls can be viewed in real-time.
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight truncate">
            Live: {poll.title}
          </h2>
          <PollStatusBadge status={poll.status} />
          <Badge className="bg-red-500 text-white animate-pulse border-none">
            LIVE
          </Badge>
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

      {/* Row 1: Live Stats Bar */}
      <LiveStatsBar
        totalResponses={totalResponses}
        recentRate={recentRate}
        connectionStatus={connectionStatus}
      />

      {/* Row 2: Real-Time Response Trend */}
      <LiveTrendChart data={trendData} />

      {/* Row 3: Recent Submissions Feed */}
      <SubmissionFeed items={feed} />

      {/* Row 4: Live Question Results */}
      <LiveQuestionBreakdown questions={questionStates} />
    </div>
  )
}
