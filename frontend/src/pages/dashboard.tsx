import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Activity, MessageSquare, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatCard } from "@/components/analytics/stat-card"
import { PollCard } from "@/components/poll/poll-card"
import { MOCK_POLLS } from "@/lib/mock-data"
import type { PollStatus } from "@/types"

type StatusFilter = "ALL" | PollStatus

export function Dashboard() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")

  const polls = MOCK_POLLS

  const totalPolls = polls.length
  const activePolls = polls.filter((p) => p.status === "ACTIVE").length
  const totalResponses = polls.reduce(
    (sum, p) => sum + p._count.submission,
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
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <BarChart3 className="mb-3 size-10 text-muted-foreground/50" />
          <p className="font-heading text-lg font-medium">No polls found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search or filter."
              : "Create your first poll to get started."}
          </p>
          {!search && statusFilter === "ALL" && (
            <Button asChild className="mt-4">
              <Link to="/polls/create">
                <Plus className="size-4" data-icon="inline-start" />
                Create Poll
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
