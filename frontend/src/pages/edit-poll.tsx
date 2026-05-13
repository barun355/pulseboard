import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Plus,
  Loader2,
  ChevronDown,
  ChevronDownIcon,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Info,
  HelpCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { QuestionCard } from "@/components/poll/question-card"
import { QuestionFormDialog } from "@/components/poll/question-form-dialog"
import { slugify, deriveOptionValues } from "@/lib/utils"
import {
  createPollSchema,
  type CreatePollFormData,
} from "@/lib/schemas/create-poll.schema"
import type { QuestionFormData } from "@/lib/schemas/question.schema"
import { MOCK_POLLS, MOCK_QUESTIONS } from "@/lib/mock-data"
import type { PollWithQuestions, QuestionWithOptions } from "@/types"

export function EditPoll() {
  const { pollId } = useParams<{ pollId: string }>()
  const navigate = useNavigate()

  const [poll, setPoll] = useState<PollWithQuestions | null>(null)
  const [loading, setLoading] = useState(true)
  const [settingsExpanded, setSettingsExpanded] = useState(false)

  // Question dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionWithOptions | null>(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] =
    useState<QuestionWithOptions | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Load poll data
  useEffect(() => {
    // TODO: Replace with API call
    const mockPoll = MOCK_POLLS.find((p) => p.id === pollId)
    if (mockPoll) {
      const questions = MOCK_QUESTIONS[pollId!] ?? []
      setPoll({
        ...mockPoll,
        questions: questions.sort((a, b) => a.order - b.order),
      })
    }
    setLoading(false)
  }, [pollId])

  const canEdit = poll?.status === "DRAFT" || poll?.status === "ACTIVE"
  const canEditQuestions = poll?.status === "DRAFT"
  const canEditAllSettings = poll?.status === "DRAFT"

  // -- Question handlers --

  function handleAddQuestion() {
    setEditingQuestion(null)
    setDialogOpen(true)
  }

  function handleEditQuestion(question: QuestionWithOptions) {
    setEditingQuestion(question)
    setDialogOpen(true)
  }

  async function handleSaveQuestion(data: QuestionFormData) {
    if (!poll) return

    const optionsWithValues = deriveOptionValues(data.options)
    const ts = new Date().toISOString()

    if (editingQuestion) {
      // Update existing question
      // TODO: API call — POST /api/poll/:pollId/questions/update
      const updated: QuestionWithOptions = {
        ...editingQuestion,
        title: data.title,
        description: data.description || null,
        isOptional: data.isOptional,
        updatedAt: ts,
        options: optionsWithValues.map((o, i) => ({
          id: editingQuestion.options[i]?.id ?? `new-${Date.now()}-${i}`,
          questionId: editingQuestion.id,
          ...o,
          createdAt: editingQuestion.options[i]?.createdAt ?? ts,
          updatedAt: ts,
        })),
      }

      setPoll({
        ...poll,
        questions: poll.questions.map((q) =>
          q.id === editingQuestion.id ? updated : q
        ),
      })

      toast.success("Question updated")
    } else {
      // Add new question
      // TODO: API call — POST /api/poll/:pollId/questions/add
      const newId = `q-${Date.now()}`
      const newQuestion: QuestionWithOptions = {
        id: newId,
        pollId: poll.id,
        order: poll.questions.length + 1,
        title: data.title,
        description: data.description || null,
        isOptional: data.isOptional,
        createdAt: ts,
        updatedAt: ts,
        options: optionsWithValues.map((o, i) => ({
          id: `o-${Date.now()}-${i}`,
          questionId: newId,
          ...o,
          createdAt: ts,
          updatedAt: ts,
        })),
      }

      setPoll({
        ...poll,
        questions: [...poll.questions, newQuestion],
      })

      toast.success("Question added")
    }
  }

  async function handleDeleteQuestion() {
    if (!poll || !deleteTarget) return

    setDeleting(true)
    // TODO: API call — DELETE /api/poll/:pollId/questions/:questionId
    await new Promise((r) => setTimeout(r, 300))

    const remaining = poll.questions
      .filter((q) => q.id !== deleteTarget.id)
      .map((q, i) => ({ ...q, order: i + 1 }))

    setPoll({ ...poll, questions: remaining })
    setDeleteTarget(null)
    setDeleting(false)
    toast.success("Question deleted")
  }

  function handleMoveQuestion(index: number, direction: "up" | "down") {
    if (!poll) return
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= poll.questions.length) return

    const updated = [...poll.questions]
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    const reordered = updated.map((q, i) => ({ ...q, order: i + 1 }))

    setPoll({ ...poll, questions: reordered })
    // TODO: API call to persist new order
  }

  // -- Status handler --

  async function handleStatusChange(
    newStatus: "ACTIVE" | "CLOSED"
  ) {
    if (!poll) return

    if (newStatus === "ACTIVE" && poll.questions.length === 0) {
      toast.error("Add at least one question before activating the poll")
      return
    }

    // TODO: API call — PATCH /api/poll/:pollId/status
    setPoll({ ...poll, status: newStatus })
    toast.success(
      newStatus === "ACTIVE"
        ? "Poll is now live!"
        : "Poll has been closed."
    )
  }

  // -- Loading / not found --

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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight truncate">
              {poll.title}
            </h2>
            <PollStatusBadge status={poll.status} />
          </div>
          {poll.description && (
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {poll.description}
            </p>
          )}
        </div>
      </div>

      {/* Non-editable banner */}
      {!canEdit && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm">
          <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            This poll is <strong>{poll.status.toLowerCase()}</strong> and cannot
            be edited.
          </span>
        </div>
      )}

      {/* Poll Settings Card */}
      {canEdit && (
        <PollSettingsCard
          poll={poll}
          expanded={settingsExpanded}
          onToggle={() => setSettingsExpanded(!settingsExpanded)}
          canEditAll={canEditAllSettings}
          onSave={(updatedPoll) => setPoll(updatedPoll)}
        />
      )}

      {/* Questions section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">
            Questions ({poll.questions.length})
          </h3>
          {canEditQuestions && (
            <Button size="sm" onClick={handleAddQuestion}>
              <Plus className="size-4" />
              Add Question
            </Button>
          )}
        </div>

        {poll.questions.length > 0 ? (
          <div className="space-y-3">
            {poll.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isFirst={index === 0}
                isLast={index === poll.questions.length - 1}
                canEdit={canEditQuestions}
                onEdit={() => handleEditQuestion(question)}
                onDelete={() => setDeleteTarget(question)}
                onMoveUp={() => handleMoveQuestion(index, "up")}
                onMoveDown={() => handleMoveQuestion(index, "down")}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <HelpCircle className="mb-3 size-8 text-muted-foreground/50" />
              <p className="font-heading text-base font-medium">
                No questions yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first question to get started.
              </p>
              {canEditQuestions && (
                <Button className="mt-4" size="sm" onClick={handleAddQuestion}>
                  <Plus className="size-4" />
                  Add Question
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom actions */}
      {canEdit && (
        <div className="flex items-center justify-end gap-3 border-t pt-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
          {poll.status === "DRAFT" && (
            <Button onClick={() => handleStatusChange("ACTIVE")}>
              Activate & Go Live
            </Button>
          )}
          {poll.status === "ACTIVE" && (
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("CLOSED")}
            >
              Close Poll
            </Button>
          )}
        </div>
      )}

      {/* Question form dialog */}
      <QuestionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        question={editingQuestion}
        onSave={handleSaveQuestion}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuestion}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ----- Poll Settings Card (collapsible) -----

function PollSettingsCard({
  poll,
  expanded,
  onToggle,
  canEditAll,
  onSave,
}: {
  poll: PollWithQuestions
  expanded: boolean
  onToggle: () => void
  canEditAll: boolean
  onSave: (poll: PollWithQuestions) => void
}) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showAccessCode, setShowAccessCode] = useState(false)
  const slugTouched = useRef(true) // Don't auto-generate for existing polls

  const expiryDate = poll.expiresAt
    ? format(new Date(poll.expiresAt), "yyyy-MM-dd")
    : ""
  const expiryTime = poll.expiresAt
    ? format(new Date(poll.expiresAt), "HH:mm:ss")
    : "23:59:00"

  const form = useForm<CreatePollFormData>({
    resolver: joiResolver(createPollSchema),
    defaultValues: {
      title: poll.title,
      slug: poll.slug,
      description: poll.description ?? "",
      expiryDate,
      expiryTime,
      isPublic: poll.isPublic,
      isAnonymousSubmissionAllowed: poll.isAnonymousSubmissionAllowed,
      accessCode: poll.accessCode ?? "",
    },
    mode: "onTouched",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty },
  } = form

  const title = watch("title")
  const isPublic = watch("isPublic")
  const expiryDateField = watch("expiryDate")
  const selectedDate = expiryDateField ? new Date(expiryDateField) : undefined

  // Auto-generate slug only for new polls (slugTouched starts true for edit)
  useEffect(() => {
    if (slugTouched.current) return
    setValue("slug", slugify(title))
  }, [title, setValue])

  useEffect(() => {
    if (isPublic) {
      setValue("accessCode", "", { shouldValidate: false })
    }
  }, [isPublic, setValue])

  async function onSubmit(data: CreatePollFormData) {
    const expiresAt = new Date(
      `${data.expiryDate}T${data.expiryTime}`
    ).toISOString()

    // TODO: API call — PATCH /api/poll/:pollId
    await new Promise((r) => setTimeout(r, 500))

    onSave({
      ...poll,
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      expiresAt,
      isPublic: data.isPublic,
      isAnonymousSubmissionAllowed: data.isAnonymousSubmissionAllowed,
      accessCode: data.isPublic ? null : data.accessCode,
    })

    toast.success("Poll settings updated")
  }

  return (
    <Card className="shadow-ambient">
      {/* Collapsed summary + toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-4 text-left cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <CardTitle className="text-base">Poll Settings</CardTitle>
          <span className="text-xs text-muted-foreground">
            {poll.isPublic ? "Public" : "Private"} · Expires{" "}
            {format(new Date(poll.expiresAt), "MMM d, yyyy")}
          </span>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded form */}
      {expanded && (
        <CardContent className="border-t pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="edit-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="edit-title"
                      disabled={!canEditAll && poll.status === "ACTIVE"}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Slug (read-only for ACTIVE polls) */}
              <Controller
                name="slug"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="edit-slug">Slug</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>/poll/</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="edit-slug"
                        disabled={!canEditAll}
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          slugTouched.current = true
                          field.onChange(e)
                        }}
                      />
                    </InputGroup>
                    {!canEditAll && (
                      <FieldDescription>
                        Slug cannot be changed for active polls.
                      </FieldDescription>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="edit-desc">
                      Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="edit-desc"
                      rows={2}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Expiry Date + Time */}
              <div className="flex gap-4">
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="flex-1"
                      data-invalid={fieldState.invalid || undefined}
                    >
                      <FieldLabel htmlFor="edit-expiryDate">
                        Expiry Date
                      </FieldLabel>
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="edit-expiryDate"
                            className="w-full justify-between font-normal"
                            aria-invalid={fieldState.invalid}
                          >
                            {selectedDate
                              ? format(selectedDate, "PPP")
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            defaultMonth={selectedDate}
                            disabled={{ before: new Date() }}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "yyyy-MM-dd"))
                              }
                              setCalendarOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="expiryTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="w-32"
                      data-invalid={fieldState.invalid || undefined}
                    >
                      <FieldLabel htmlFor="edit-expiryTime">Time</FieldLabel>
                      <Input
                        {...field}
                        id="edit-expiryTime"
                        type="time"
                        step="1"
                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* isPublic */}
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="edit-isPublic">
                        Public Poll
                      </FieldLabel>
                      <FieldDescription>
                        {field.value ? (
                          <span className="flex items-center gap-1.5">
                            <Globe className="size-3.5" />
                            Anyone with the link can respond.
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Lock className="size-3.5" />
                            Respondents need an access code.
                          </span>
                        )}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="edit-isPublic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!canEditAll}
                    />
                  </Field>
                )}
              />

              {/* Access Code (conditional) */}
              {!isPublic && (
                <Controller
                  name="accessCode"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="edit-accessCode">
                        Access Code
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <InputGroupText>
                            <Lock className="size-4" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="edit-accessCode"
                          type={showAccessCode ? "text" : "password"}
                          placeholder="e.g. A1B2C3"
                          maxLength={6}
                          className="font-mono tracking-widest uppercase"
                          disabled={!canEditAll}
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/[^a-zA-Z0-9]/g, "")
                              .toUpperCase()
                              .slice(0, 6)
                            field.onChange(value)
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <button
                            type="button"
                            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowAccessCode(!showAccessCode)}
                            tabIndex={-1}
                          >
                            {showAccessCode ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {/* isAnonymous */}
              <Controller
                name="isAnonymousSubmissionAllowed"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="edit-isAnonymous">
                        Allow Anonymous Responses
                      </FieldLabel>
                      <FieldDescription>
                        {field.value
                          ? "Respondents can submit without signing in."
                          : "Respondents must be signed in to submit."}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="edit-isAnonymous"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!canEditAll}
                    />
                  </Field>
                )}
              />

              {/* Save */}
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  {isSubmitting ? "Saving..." : "Update Settings"}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
