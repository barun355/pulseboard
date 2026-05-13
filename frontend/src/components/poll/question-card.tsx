import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Circle,
  GripVertical,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { QuestionWithOptions } from "@/types"

interface QuestionCardProps {
  question: QuestionWithOptions
  index: number
  isFirst: boolean
  isLast: boolean
  canEdit: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function QuestionCard({
  question,
  index,
  isFirst,
  isLast,
  canEdit,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionCardProps) {
  return (
    <Card className="shadow-ambient">
      <CardContent className="space-y-3">
        {/* Header: order + title + actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            {canEdit && (
              <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  Q{index + 1}
                </span>
                <h4 className="font-heading text-sm font-semibold leading-snug truncate">
                  {question.title}
                </h4>
              </div>
              {question.description && (
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {question.description}
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onMoveUp}
                disabled={isFirst}
                aria-label="Move up"
              >
                <ChevronUp className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onMoveDown}
                disabled={isLast}
                aria-label="Move down"
              >
                <ChevronDown className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onEdit}
                aria-label="Edit question"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onDelete}
                aria-label="Delete question"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-6">
          {question.options
            .sort((a, b) => a.order - b.order)
            .map((option) => (
              <span
                key={option.id}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Circle className="size-3" />
                {option.name}
              </span>
            ))}
        </div>

        {/* Footer: metadata */}
        <div className="flex items-center gap-2 pl-6">
          <Badge variant={question.isOptional ? "secondary" : "outline"}>
            {question.isOptional ? "Optional" : "Required"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {question.options.length} option
            {question.options.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
