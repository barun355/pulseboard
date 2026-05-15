import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  BarChart3,
  HelpCircle,
  Inbox,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { SharePollDialog } from "@/components/poll/share-poll-dialog"
import { ResponsesToolbar } from "@/components/responses/responses-toolbar"
import { ResponsesTable } from "@/components/responses/responses-table"
import { Pagination } from "@/components/responses/pagination"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { generateCsv, downloadCsv } from "@/lib/csv-export"
import { pollQueries } from "@/queries/poll.queries"
import { submissionQueries } from "@/queries/submission.queries"
import type { QuestionWithOptions } from "@/types"

const PAGE_SIZE = 20

export function PollResponses() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const { data: poll, isLoading: pollLoading } = useQuery(pollQueries.detail(pollId!))
  const { data: allResponses = [], isLoading: responsesLoading } = useQuery(submissionQueries.byPoll(pollId!))

  const questions: QuestionWithOptions[] = useMemo(
    () => (poll?.questions ?? []).sort((a, b) => a.order - b.order),
    [poll],
  )
  const loading = pollLoading || responsesLoading

  const [search, setSearch] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [shareOpen, setShareOpen] = useState(false)

  // Filter responses
  const filtered = useMemo(() => {
    return allResponses.filter((r) => {
      const matchesSearch =
        !search ||
        r.respondent.toLowerCase().includes(search.toLowerCase())

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "none" && r.rating == null) ||
        (ratingFilter !== "none" && r.rating === Number(ratingFilter))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && r.isCompleted) ||
        (statusFilter === "partial" && !r.isCompleted)

      return matchesSearch && matchesRating && matchesStatus
    })
  }, [allResponses, search, ratingFilter, statusFilter])

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [search, ratingFilter, statusFilter])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageOffset = (page - 1) * PAGE_SIZE
  const pageData = filtered.slice(pageOffset, pageOffset + PAGE_SIZE)

  function handleExportAll() {
    const csv = generateCsv(allResponses, questions)
    downloadCsv(csv, `${poll?.slug ?? "poll"}-responses-all.csv`)
  }

  function handleExportFiltered() {
    const csv = generateCsv(filtered, questions)
    downloadCsv(csv, `${poll?.slug ?? "poll"}-responses-filtered.csv`)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        {/* Table */}
        <TableSkeleton rows={10} columns={6} />
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

  if (allResponses.length === 0) {
    return (
      <Empty className="mx-auto max-w-3xl py-20">
        <EmptyHeader>
          <EmptyMedia>
            <Inbox className="size-10 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>
            "Every voice matters — but first, someone needs to hear the question."
          </EmptyTitle>
          <EmptyDescription>
            Your poll is ready but hasn't received any responses yet. Share it with your
            audience and watch the data roll in.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => setShareOpen(true)}>
            <Share2 className="size-3.5" />
            Share Poll
          </Button>
        </EmptyContent>
        <SharePollDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          poll={poll}
        />
      </Empty>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight truncate">
              Responses: {poll.title}
            </h2>
            <PollStatusBadge status={poll.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {allResponses.length} responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/polls/${pollId}/analytics`)}
          >
            <BarChart3 className="size-3.5" />
            Analytics
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

      {/* Toolbar */}
      <ResponsesToolbar
        search={search}
        onSearchChange={setSearch}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExportAll={handleExportAll}
        onExportFiltered={handleExportFiltered}
        filteredCount={filtered.length}
        totalCount={allResponses.length}
      />

      {/* Table */}
      <Card className="shadow-ambient">
        <CardContent className="p-0">
          <ResponsesTable
            responses={pageData}
            questions={questions}
            pollSlug={poll.slug}
            pageOffset={pageOffset}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
