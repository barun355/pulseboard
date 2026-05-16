import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Loader2,
  Lock,
  Globe,
  Eye,
  EyeOff,
  ChevronDownIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { slugify } from "@/lib/utils"
import {
  createPollSchema,
  type CreatePollFormData,
} from "@/lib/schemas/create-poll.schema"
import { useCreatePoll } from "@/mutations/poll.mutations"
import { useUser } from "@clerk/react"

const DEFAULT_VALUES: CreatePollFormData = {
  title: "",
  slug: "",
  description: "",
  expiryDate: "",
  expiryTime: "23:59:00",
  isPublic: true,
  isAnonymousSubmissionAllowed: true,
  isAllowedToEditAfterResponse: false,
  isPublicResponseAnalyticsAllowed: false,
  accessCode: "",
}

export function CreatePoll() {
  const navigate = useNavigate()
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const slugTouched = useRef(false)
  const { user } = useUser()
  const createPoll = useCreatePoll()

  const form = useForm<CreatePollFormData>({
    resolver: joiResolver(createPollSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = form

  const title = watch("title")
  const isPublic = watch("isPublic")
  const expiryDateValue = watch("expiryDate")

  const selectedDate = expiryDateValue ? new Date(expiryDateValue) : undefined

  // Auto-generate slug from title (only if user hasn't manually edited it)
  useEffect(() => {
    if (slugTouched.current) return
    const slug = slugify(title)
    setValue("slug", slug, {
      shouldValidate: form.formState.touchedFields.slug,
    })
  }, [title, setValue, form.formState.touchedFields.slug])

  // Clear access code when switching to public
  useEffect(() => {
    if (isPublic) {
      setValue("accessCode", "", { shouldValidate: false })
    }
  }, [isPublic, setValue])

  async function onSubmit(data: CreatePollFormData) {
    const expiresAt = new Date(
      `${data.expiryDate}T${data.expiryTime}`
    ).toISOString()

    if (new Date(expiresAt) <= new Date()) {
      toast.error("Expiry date must be in the future")
      return
    }

    createPoll.mutate(
      {
        title: data.title,
        slug: data.slug,
        description: data.description,
        expiresAt,
        isPublic: data.isPublic,
        isAnonymousSubmissionAllowed: data.isAnonymousSubmissionAllowed,
        isAllowedToEditAfterResponse: data.isAllowedToEditAfterResponse,
        isPublicResponseAnalyticsAllowed: data.isPublicResponseAnalyticsAllowed,
        createdById: user?.id ?? "",
        ...(data.isPublic ? {} : { accessCode: data.accessCode }),
      },
      {
        onSuccess: (newPoll) => {
          toast.success("Poll created successfully!", {
            description: "You can now add questions to your poll.",
          })
          navigate(`/polls/${newPoll.id}/edit`)
        },
        onError: (err) => {
          toast.error("Failed to create poll", {
            description: err.message || "Something went wrong. Please try again.",
          })
        },
      },
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Create Poll
        </h2>
        <p className="text-sm text-muted-foreground">
          Set up your poll details. You'll add questions in the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="shadow-ambient">
          <CardHeader>
            <CardTitle className="text-lg">Poll Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      placeholder="e.g. Product Feature Survey"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldDescription>
                      A clear, descriptive title for your poll.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Slug */}
              <Controller
                name="slug"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>/poll/</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="slug"
                        placeholder="product-feature-survey"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) => {
                          slugTouched.current = true
                          field.onChange(e)
                        }}
                      />
                    </InputGroup>
                    <FieldDescription>
                      Auto-generated from title. Used in the shareable URL.
                    </FieldDescription>
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
                    <FieldLabel htmlFor="description">
                      Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Tell respondents what this poll is about..."
                      rows={3}
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
                      <FieldLabel htmlFor="expiryDate">Expiry Date</FieldLabel>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="expiryDate"
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
                      <FieldLabel htmlFor="expiryTime">Time</FieldLabel>
                      <Input
                        {...field}
                        id="expiryTime"
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
              <FieldDescription className="-mt-3">
                The poll will automatically close after this date and time.
              </FieldDescription>

              {/* isPublic Toggle */}
              <Controller
                name="isPublic"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="isPublic">Public Poll</FieldLabel>
                      <FieldDescription>
                        {field.value ? (
                          <span className="flex items-center gap-1.5">
                            <Globe className="size-3.5" />
                            Anyone with the link can respond.
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Lock className="size-3.5" />
                            Respondents need an access code to participate.
                          </span>
                        )}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                      <FieldLabel htmlFor="accessCode">Access Code</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <InputGroupText>
                            <Lock className="size-4" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="accessCode"
                          type={showAccessCode ? "text" : "password"}
                          placeholder="e.g. A1B2C3"
                          maxLength={6}
                          className="font-mono tracking-widest uppercase"
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
                      <FieldDescription>
                        6-character alphanumeric code. Share this privately with
                        your intended respondents.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {/* isAnonymousSubmissionAllowed Toggle */}
              <Controller
                name="isAnonymousSubmissionAllowed"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="isAnonymous">
                        Allow Anonymous Responses
                      </FieldLabel>
                      <FieldDescription>
                        {field.value
                          ? "Respondents can submit without signing in."
                          : "Respondents must be signed in to submit."}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="isAnonymous"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              {/* isAllowedToEditAfterResponse Toggle */}
              <Controller
                name="isAllowedToEditAfterResponse"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="isAllowedToEditAfterResponse">
                        Allow Response Editing
                      </FieldLabel>
                      <FieldDescription>
                        {field.value
                          ? "Respondents can edit their response after submitting."
                          : "Responses are locked once submitted."}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="isAllowedToEditAfterResponse"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />

              {/* isPublicResponseAnalyticsAllowed Toggle */}
              <Controller
                name="isPublicResponseAnalyticsAllowed"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <div className="flex flex-1 flex-col gap-0.5">
                      <FieldLabel htmlFor="isPublicResponseAnalyticsAllowed">
                        Show Results to Respondents
                      </FieldLabel>
                      <FieldDescription>
                        {field.value
                          ? "Respondents can see poll results after submitting."
                          : "Only you can view poll analytics."}
                      </FieldDescription>
                    </div>
                    <Switch
                      id="isPublicResponseAnalyticsAllowed"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || createPoll.isPending}>
            {(isSubmitting || createPoll.isPending) && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting || createPoll.isPending ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </form>
    </div>
  )
}
