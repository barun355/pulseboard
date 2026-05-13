import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, formatDistanceToNow } from "date-fns"
import {
  Loader2,
  Pencil,
  Share2,
  BarChart3,
  Radio,
  MessageSquare,
  HelpCircle,
  Star,
  Globe,
  Lock,
  Circle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/analytics/stat-card"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { SharePollDialog } from "@/components/poll/share-poll-dialog"
import { MOCK_POLLS, MOCK_QUESTIONS } from "@/lib/mock-data"
import type { PollWithCounts, QuestionWithOptions } from "@/types"

export function PollDetail() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const [poll, setPoll] = useState<PollWithCounts | null>(null)
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [loading, setLoading] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    // TODO: Replace with API call
    const found = MOCK_POLLS.find((p) => p.id === pollId) ?? null
    setPoll(found)
    setQuestions((MOCK_QUESTIONS[pollId!] ?? []).sort((a, b) => a.order - b.order))
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

  const canEdit = poll.status === "DRAFT" || poll.status === "ACTIVE"
  const hasResponses = poll._count.submission > 0
  const isLive = poll.status === "ACTIVE"

  const expiryDate = new Date(poll.expiresAt)
  const isExpired = expiryDate < new Date()
  const expiryText = isExpired
    ? "Expired"
    : `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight truncate">
            {poll.title}
          </h2>
          <PollStatusBadge status={poll.status} />
        </div>
        {poll.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {poll.description}
          </p>
        )}
      </div>

      {/* Poll Info Card */}
      <Card className="shadow-ambient">
        <CardContent className="space-y-4">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {format(new Date(poll.createdAt), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expires</p>
              <p className="text-sm font-medium">{expiryText}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="flex items-center gap-1 text-sm font-medium">
                {poll.isPublic ? (
                  <>
                    <Globe className="size-3.5" /> Public
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" /> Private
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Anonymous</p>
              <p className="text-sm font-medium">
                {poll.isAnonymousSubmissionAllowed ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Responses</p>
              <p className="text-sm font-medium">{poll._count.submission}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="text-sm font-medium">{poll._count.question}</p>
            </div>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/polls/${poll.id}/edit`)}
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="size-3.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/polls/${poll.id}/analytics`)}
              disabled={!hasResponses}
            >
              <BarChart3 className="size-3.5" />
              View Analytics
            </Button>
            {isLive && (
              <Button
                size="sm"
                onClick={() => navigate(`/polls/${poll.id}/live`)}
              >
                <Radio className="size-3.5" />
                Go Live
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Responses"
          value={poll._count.submission}
          icon={MessageSquare}
        />
        <StatCard
          title="Questions"
          value={poll._count.question}
          icon={HelpCircle}
        />
        <StatCard
          title="Avg Rating"
          value={hasResponses ? 4.2 : 0}
          subtitle={hasResponses ? "out of 5" : "No responses yet"}
          icon={Star}
        />
      </div>

      {/* Questions List */}
      <Card className="shadow-ambient">
        <CardHeader>
          <CardTitle className="text-base">
            Questions ({questions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-1.5">
                  {index > 0 && <Separator className="mb-4" />}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground">
                        {index + 1}.
                      </span>
                      <p className="text-sm font-medium leading-snug">
                        {question.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Badge
                        variant={
                          question.isOptional ? "secondary" : "outline"
                        }
                        className="text-[10px]"
                      >
                        {question.isOptional ? "Optional" : "Required"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {question.options.length} opts
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pl-5">
                    {question.options
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <span
                          key={option.id}
                          className="flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <Circle className="size-2.5" />
                          {option.name}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No questions added to this poll yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <SharePollDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        poll={poll}
      />
    </div>
  )
}
