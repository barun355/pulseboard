import { Fragment, useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { ChevronRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ResponseExpandedRow } from "./response-expanded-row"
import type { ResponseDetail, QuestionWithOptions } from "@/types"

interface ResponsesTableProps {
  responses: ResponseDetail[]
  questions: QuestionWithOptions[]
  pollSlug: string
  pageOffset: number
}

export function ResponsesTable({
  responses,
  questions,
  pollSlug,
  pageOffset,
}: ResponsesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  if (responses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No responses match your filters.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Respondent</TableHead>
          <TableHead className="w-28">Submitted</TableHead>
          <TableHead className="w-24">Rating</TableHead>
          <TableHead className="w-20">Status</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {responses.map((response, index) => {
          const isExpanded = expandedId === response.id

          return (
            <Fragment key={response.id}>
              <TableRow
                className="cursor-pointer"
                onClick={() => toggleExpand(response.id)}
                aria-expanded={isExpanded}
              >
                <TableCell className="text-muted-foreground">
                  {pageOffset + index + 1}
                </TableCell>
                <TableCell className="max-w-[200px] truncate font-medium">
                  {response.respondent}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(response.submittedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(new Date(response.submittedAt), "PPP p")}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {response.rating != null ? (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "size-3",
                            i < response.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={response.isCompleted ? "default" : "secondary"}
                    className={cn(
                      "text-[10px]",
                      response.isCompleted
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/10"
                        : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10"
                    )}
                  >
                    {response.isCompleted ? "Done" : "Partial"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ChevronRight
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )}
                  />
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0 px-2 pb-3">
                    <ResponseExpandedRow
                      response={response}
                      questions={questions}
                      pollSlug={pollSlug}
                    />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}
