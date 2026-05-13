import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, HelpCircle, Loader2, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { LiveStatsBar } from "@/components/live/live-stats-bar"
import { LiveTrendChart } from "@/components/live/live-trend-chart"
import { LiveQuestionBreakdown } from "@/components/live/live-question-breakdown"
import { SubmissionFeed } from "@/components/live/submission-feed"
import { usePollSocket } from "@/hooks/use-poll-socket"
import { MOCK_POLLS, MOCK_ANALYTICS, MOCK_QUESTIONS } from "@/lib/mock-data"
import type {
  PollWithCounts,
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

  const [poll, setPoll] = useState<PollWithCounts | null>(null)
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [loading, setLoading] = useState(true)

  // Live state
  const [totalResponses, setTotalResponses] = useState(0)
  const [recentRate, setRecentRate] = useState(0)
  const [questionStates, setQuestionStates] = useState<LiveQuestionState[]>([])
  const [trendData, setTrendData] = useState<LiveTrendPoint[]>([])
  const [feed, setFeed] = useState<LiveResponseEvent[]>([])

  const recentTimestamps = useRef<number[]>([])

  // Load initial data
  useEffect(() => {
    const found = MOCK_POLLS.find((p) => p.id === pollId) ?? null
    setPoll(found)

    const qs = (MOCK_QUESTIONS[pollId!] ?? []).sort((a, b) => a.order - b.order)
    setQuestions(qs)

    const analytics = MOCK_ANALYTICS[pollId!]
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
      // Seed trend with current time
      setTrendData([
        {
          time: format(new Date(), "HH:mm"),
          count: analytics.overview.totalResponses,
        },
      ])
    } else {
      // No analytics yet — initialize from questions
      setQuestionStates(
        qs.map((q) => ({
          questionId: q.id,
          title: q.title,
          options: q.options
            .sort((a, b) => a.order - b.order)
            .map((o) => ({ optionId: o.id, name: o.name, count: 0 })),
          totalResponses: 0,
        }))
      )
    }

    setLoading(false)
  }, [pollId])

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

  if (poll.status !== "ACTIVE") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-20 text-center">
        <Radio className="mx-auto size-10 text-muted-foreground/50" />
        <p className="font-heading text-lg font-medium">
          This poll is not live
        </p>
        <p className="text-sm text-muted-foreground">
          Only active polls can be viewed in real-time.
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
