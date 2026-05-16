import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, formatDistanceToNow } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import {
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
  FileSpreadsheet,
  Loader2,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { StatCard } from "@/components/analytics/stat-card"
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { SharePollDialog } from "@/components/poll/share-poll-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { pollQueries } from "@/queries/poll.queries"
import { useUpdatePollStatus } from "@/mutations/poll.mutations"

export function PollDetail() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()
  const [shareOpen, setShareOpen] = useState(false)
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)

  const { data: poll, isLoading, error } = useQuery(pollQueries.detail(pollId!))
  const updatePollStatusMutation = useUpdatePollStatus()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        {/* Info Card */}
        <Card className="shadow-ambient">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        {/* Questions Card */}
        <Card className="shadow-ambient">
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <Skeleton className="mt-0.5 h-4 w-5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex gap-3 pl-5">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-14" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <Empty className="mx-auto max-w-3xl py-20">
        <EmptyHeader>
          <EmptyMedia>
            <HelpCircle className="size-10 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>This poll doesn't exist</EmptyTitle>
          <EmptyDescription>
            It may have been deleted or the link might be incorrect.
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

  const questions = (poll.questions ?? []).sort((a, b) => a.order - b.order)
  const questionCount = questions.length
  const submissionCount = (poll as any)._count?.submissions ?? 0
  const canEdit = poll.status === "DRAFT"
  const hasResponses = submissionCount > 0
  const isLive = poll.status === "PUBLISHED"
  const canClose = poll.status === "PUBLISHED" || poll.status === "ACTIVE"

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
              <p className="text-sm font-medium">{submissionCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Questions</p>
              <p className="text-sm font-medium">{questionCount}</p>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/polls/${poll.id}/responses`)}
              disabled={!hasResponses}
            >
              <FileSpreadsheet className="size-3.5" />
              View Responses
            </Button>
            {isLive && (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate(`/polls/${poll.id}/live`)}
                >
                  <Radio className="size-3.5" />
                  Go Live
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={updatePollStatusMutation.isPending}
                  onClick={() =>
                    updatePollStatusMutation.mutate(
                      { pollId: poll.id, status: "DRAFT" },
                      {
                        onSuccess: () => toast.success("Poll unpublished"),
                        onError: () => toast.error("Failed to unpublish poll"),
                      },
                    )
                  }
                >
                  {updatePollStatusMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : null}
                  Unpublish
                </Button>
              </>
            )}
            {canClose && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCloseConfirmOpen(true)}
              >
                <XCircle className="size-3.5" />
                Close Poll
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Responses"
          value={submissionCount}
          icon={MessageSquare}
        />
        <StatCard
          title="Questions"
          value={questionCount}
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

      {/* Close Poll Confirmation Dialog */}
      <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close this poll?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Once closed, no new responses will be
              accepted and the poll status cannot be changed back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={updatePollStatusMutation.isPending}
              onClick={() =>
                updatePollStatusMutation.mutate(
                  { pollId: poll.id, status: "CLOSED" },
                  {
                    onSuccess: () => {
                      toast.success("Poll closed")
                      setCloseConfirmOpen(false)
                    },
                    onError: () => toast.error("Failed to close poll"),
                  },
                )
              }
            >
              {updatePollStatusMutation.isPending && (
                <Loader2 className="size-3.5 animate-spin" />
              )}
              Close Poll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
