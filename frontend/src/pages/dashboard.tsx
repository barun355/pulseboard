import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Activity, MessageSquare, Plus, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/analytics/stat-card"
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton"
import { PollCard } from "@/components/poll/poll-card"
import { PollCardSkeleton } from "@/components/skeletons/poll-card-skeleton"
import { pollQueries } from "@/queries/poll.queries"
import type { PollStatus } from "@/types"

type StatusFilter = "ALL" | PollStatus

export function Dashboard() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")

  const { data: polls = [], isLoading, error } = useQuery(pollQueries.list())

  const totalPolls = polls.length
  const activePolls = polls.filter((p) => p.status === "ACTIVE").length
  const totalResponses = polls.reduce(
    (sum, p) => sum + p._count.submissions,
    0
  )

  const filteredPolls = useMemo(() => {
    return polls.filter((poll) => {
      const matchesSearch = poll.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === "ALL" || poll.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [polls, search, statusFilter])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <p className="text-sm text-destructive">
              Failed to load polls. Please try again.
            </p>
          </div>
          <Button asChild>
            <Link to="/polls/create">
              <Plus className="size-4" data-icon="inline-start" />
              Create Poll
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your polls and track responses.
          </p>
        </div>
        <Button asChild>
          <Link to="/polls/create">
            <Plus className="size-4" data-icon="inline-start" />
            Create Poll
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Polls"
          value={totalPolls}
          icon={BarChart3}
        />
        <StatCard
          title="Active Polls"
          value={activePolls}
          icon={Activity}
        />
        <StatCard
          title="Total Responses"
          value={totalResponses}
          icon={MessageSquare}
        />
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search polls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Poll list */}
      {filteredPolls.length > 0 ? (
        <div className="space-y-3">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : search || statusFilter !== "ALL" ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia>
              <Search className="size-10 text-muted-foreground/50" />
            </EmptyMedia>
            <EmptyTitle>No matching polls</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filter to find what you're looking for.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia>
              <BarChart3 className="size-10 text-muted-foreground/50" />
            </EmptyMedia>
            <EmptyTitle>
              "The best decisions are made with data, not assumptions."
            </EmptyTitle>
            <EmptyDescription>
              Create your first poll and start turning opinions into insights.
              It only takes 60 seconds.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/polls/create">
                <Plus className="size-4" data-icon="inline-start" />
                Create Your First Poll
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
