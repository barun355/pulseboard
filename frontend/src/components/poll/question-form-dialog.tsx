import { useEffect, useState } from "react"
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import {
  questionSchema,
  type QuestionFormData,
} from "@/lib/schemas/question.schema"
import type { QuestionWithOptions } from "@/types"

interface QuestionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: QuestionWithOptions | null
  onSave: (data: QuestionFormData) => Promise<void>
}

interface FieldErrors {
  title?: string
  options?: string
  optionNames?: Record<number, string>
}

const EMPTY_FORM: QuestionFormData = {
  title: "",
  description: "",
  isOptional: false,
  options: [{ name: "" }, { name: "" }],
}

export function QuestionFormDialog({
  open,
  onOpenChange,
  question,
  onSave,
}: QuestionFormDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isOptional, setIsOptional] = useState(false)
  const [options, setOptions] = useState<{ name: string }[]>([
    { name: "" },
    { name: "" },
  ])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  const isEditing = question !== null

  // Pre-fill or reset when dialog opens
  useEffect(() => {
    if (!open) return

    if (question) {
      setTitle(question.title)
      setDescription(question.description ?? "")
      setIsOptional(question.isOptional)
      setOptions(
        question.options
          .sort((a, b) => a.order - b.order)
          .map((o) => ({ name: o.name }))
      )
    } else {
      setTitle(EMPTY_FORM.title)
      setDescription(EMPTY_FORM.description)
      setIsOptional(EMPTY_FORM.isOptional)
      setOptions([...EMPTY_FORM.options])
    }
    setErrors({})
  }, [open, question])

  function validate(): boolean {
    const data: QuestionFormData = { title, description, isOptional, options }
    const result = questionSchema.validate(data, {
      abortEarly: false,
      allowUnknown: false,
    })

    if (!result.error) {
      setErrors({})
      return true
    }

    const fieldErrors: FieldErrors = {}
    for (const detail of result.error.details) {
      const path = detail.path
      if (path[0] === "title") {
        fieldErrors.title = detail.message
      } else if (path[0] === "options" && path.length === 1) {
        fieldErrors.options = detail.message
      } else if (
        path[0] === "options" &&
        typeof path[1] === "number" &&
        path[2] === "name"
      ) {
        if (!fieldErrors.optionNames) fieldErrors.optionNames = {}
        fieldErrors.optionNames[path[1]] = detail.message
      }
    }
    setErrors(fieldErrors)
    return false
  }

  async function handleSave() {
    if (!validate()) return

    setSaving(true)
    try {
      await onSave({ title, description, isOptional, options })
      onOpenChange(false)
    } catch {
      // Parent handles error toast
    } finally {
      setSaving(false)
    }
  }

  function addOption() {
    if (options.length >= 10) return
    setOptions([...options, { name: "" }])
  }

  function removeOption(index: number) {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== index))
  }

  function updateOptionName(index: number, name: string) {
    const updated = [...options]
    updated[index] = { name }
    setOptions(updated)
  }

  function moveOption(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= options.length) return
    const updated = [...options]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    setOptions(updated)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Add Question"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the question details and options."
              : "Add a new question with at least 2 options."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-0.5">
          <FieldGroup>
            {/* Title */}
            <Field data-invalid={errors.title ? true : undefined}>
              <FieldLabel htmlFor="q-title">Question Title</FieldLabel>
              <Input
                id="q-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Which feature matters most to you?"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <FieldError>{errors.title}</FieldError>
              )}
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="q-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                id="q-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional context for respondents..."
                rows={2}
              />
            </Field>

            {/* isOptional */}
            <Field orientation="horizontal">
              <div className="flex flex-1 flex-col gap-0.5">
                <FieldLabel htmlFor="q-optional">Optional Question</FieldLabel>
                <FieldDescription>
                  {isOptional
                    ? "Respondents can skip this question."
                    : "Respondents must answer this question."}
                </FieldDescription>
              </div>
              <Switch
                id="q-optional"
                checked={isOptional}
                onCheckedChange={setIsOptional}
              />
            </Field>

            {/* Options */}
            <Field data-invalid={errors.options ? true : undefined}>
              <FieldLabel>Options</FieldLabel>
              <FieldDescription>
                Add at least 2 options. Values are auto-generated from names.
              </FieldDescription>

              <div className="space-y-2 mt-1">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                      {index + 1}.
                    </span>
                    <Input
                      value={option.name}
                      onChange={(e) => updateOptionName(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                      aria-invalid={!!errors.optionNames?.[index]}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveOption(index, "up")}
                      disabled={index === 0}
                      aria-label="Move option up"
                    >
                      <ChevronUp className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveOption(index, "down")}
                      disabled={index === options.length - 1}
                      aria-label="Move option down"
                    >
                      <ChevronDown className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                      aria-label="Remove option"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-2"
                >
                  <Plus className="size-3.5" />
                  Add Option
                </Button>
              )}

              {errors.options && (
                <FieldError>{errors.options}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Question"
                : "Add Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
