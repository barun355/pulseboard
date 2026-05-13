import { Badge } from "@/components/ui/badge"
import type { PollStatus } from "@/types"

const STATUS_CONFIG: Record<PollStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  PUBLISHED: {
    label: "Published",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
}

export function PollStatusBadge({ status }: { status: PollStatus }) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
