import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { ChevronRight, BarChart3, Pencil, Eye, MessageSquare, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PollStatusBadge } from "./poll-status-badge"
import type { PollWithCounts } from "@/types"

function getExpiryText(expiresAt: string): string {
  const expiry = new Date(expiresAt)
  if (expiry < new Date()) return "Expired"
  return `Expires ${formatDistanceToNow(expiry, { addSuffix: true })}`
}

export function PollCard({ poll }: { poll: PollWithCounts }) {
  const navigate = useNavigate()

  const canEdit = poll.status === "DRAFT" || poll.status === "ACTIVE"

  return (
    <Card
      className="cursor-pointer shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
      onClick={() => navigate(`/polls/${poll.id}`)}
    >
      <CardContent className="space-y-3">
        {/* Row 1: Title + status + response count */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-semibold leading-snug truncate">
            {poll.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <PollStatusBadge status={poll.status} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="size-3" />
              {poll._count.submission}
            </span>
          </div>
        </div>

        {/* Row 2: Description */}
        {poll.description && (
          <p className="truncate text-sm text-muted-foreground">
            {poll.description}
          </p>
        )}

        {/* Row 3: Metadata + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              Created{" "}
              {formatDistanceToNow(new Date(poll.createdAt), {
                addSuffix: true,
              })}
            </span>
            <span className="text-border">|</span>
            <span>{getExpiryText(poll.expiresAt)}</span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1">
              <HelpCircle className="size-3" />
              {poll._count.question} questions
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/polls/${poll.id}/analytics`)
              }}
              aria-label="View analytics"
            >
              <BarChart3 className="size-3.5" />
            </Button>
            {canEdit ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/polls/${poll.id}/edit`)
                }}
                aria-label="Edit poll"
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/polls/${poll.id}`)
                }}
                aria-label="View poll"
              >
                <Eye className="size-3.5" />
              </Button>
            )}
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
