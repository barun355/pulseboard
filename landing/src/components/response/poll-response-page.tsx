"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { Loader2, AlertCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient, ApiError } from "@/lib/api"
import type { Poll, SubmitPayload } from "@/lib/types"
import { AccessCodeGate } from "./access-code-gate"
import { PollSubmitted } from "./poll-submitted"
import { PollWizard, type WizardSubmitData } from "./poll-wizard"

type PageState =
  | { kind: "loading" }
  | { kind: "access-code"; error: string | null }
  | { kind: "form"; poll: Poll }
  | { kind: "submitted"; poll: Poll }
  | { kind: "error"; message: string; needsLogin?: boolean }

export function PollResponsePage({ pollId }: { pollId: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { getToken, isSignedIn } = useAuth()

  const [state, setState] = useState<PageState>({ kind: "loading" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [accessCodePending, setAccessCodePending] = useState(false)
  const [lastSubmission, setLastSubmission] = useState<WizardSubmitData | null>(null)

  // Metadata captured on mount
  const startedAt = useRef(new Date().toISOString())
  const metaRef = useRef({
    locale: "",
    timezone: "",
    screenResolution: null as string | null,
    referrer: null as string | null,
    utmSource: null as string | null,
    utmMedium: null as string | null,
    utmCampaign: null as string | null,
  })
  const accessCodeRef = useRef<string | undefined>(undefined)

  // Capture browser metadata on mount
  useEffect(() => {
    metaRef.current = {
      locale: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer || null,
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
    }
  }, [searchParams])

  const fetchPoll = useCallback(
    async (accessCode?: string, reSubmit?: boolean) => {
      try {
        const token = isSignedIn ? await getToken() : null
        const slug = searchParams.get("slug") || ""
        let url = `/submit/${pollId}?slug=${encodeURIComponent(slug)}`
        if (accessCode) {
          url += `&accessCode=${encodeURIComponent(accessCode)}`
          accessCodeRef.current = accessCode
        }
        if (reSubmit) {
          url += `&reSubmit=true`
        }

        const data = await apiClient<Poll | { accessCodeRequired: true }>(
          url,
          {},
          token,
        )

        if ("accessCodeRequired" in data && data.accessCodeRequired) {
          setState({ kind: "access-code", error: null })
          return
        }

        setState({ kind: "form", poll: data as Poll })
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again."
        const needsLogin =
          err instanceof ApiError &&
          err.status === 401 &&
          /login/i.test(err.message)
        setState({ kind: "error", message, needsLogin })
      }
    },
    [pollId, searchParams, getToken, isSignedIn],
  )

  // Fetch poll on mount
  useEffect(() => {
    fetchPoll()
  }, [fetchPoll])

  async function handleAccessCode(code: string) {
    setAccessCodePending(true)
    setState({ kind: "access-code", error: null })
    try {
      await fetchPoll(code)
    } catch {
      setState({
        kind: "access-code",
        error: "Invalid access code. Please try again.",
      })
    } finally {
      setAccessCodePending(false)
    }
  }

  async function handleSubmit(wizardData: WizardSubmitData) {
    if (state.kind !== "form") return
    const { poll } = state

    setIsSubmitting(true)
    setSubmitError(null)

    const payload: SubmitPayload = {
      responses: poll.questions.map((q) => ({
        questionId: q.id,
        optionId: wizardData.answers[q.id] || null,
      })),
      feedback: wizardData.feedback,
      rating: wizardData.rating,
      accessCode: accessCodeRef.current,
      startedAt: startedAt.current,
      spendTimePerQuestion: wizardData.spendTimePerQuestion,
      ...metaRef.current,
    }

    try {
      const token = isSignedIn ? await getToken() : null
      await apiClient(
        `/submit/${pollId}/response`,
        { method: "POST", body: JSON.stringify(payload) },
        token,
      )
      setLastSubmission(wizardData)
      setState({ kind: "submitted", poll })
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Failed to submit response. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEditResponse() {
    if (state.kind !== "submitted") return
    setState({ kind: "loading" })
    startedAt.current = new Date().toISOString()
    await fetchPoll(accessCodeRef.current, true)
  }

  // --- Render ---

  if (state.kind === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (state.kind === "error") {
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <p className="font-heading text-lg font-semibold mb-1">
            {state.needsLogin ? "Sign in required" : "Unable to load poll"}
          </p>
          <p className="text-sm text-muted-foreground">{state.message}</p>
          {state.needsLogin && (
            <SignInButton forceRedirectUrl={currentUrl}>
              <Button className="mt-6">
                <LogIn className="size-4" />
                Sign in to continue
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    )
  }

  if (state.kind === "access-code") {
    return (
      <AccessCodeGate
        onSubmit={handleAccessCode}
        isPending={accessCodePending}
        error={state.error}
      />
    )
  }

  if (state.kind === "submitted") {
    return (
      <PollSubmitted
        canEdit={state.poll.isAllowedToEditAfterResponse}
        onEdit={handleEditResponse}
        pollId={pollId}
        showAnalytics={state.poll.isPublicResponseAnalyticsAllowed}
      />
    )
  }

  // state.kind === "form"
  return (
    <PollWizard
      poll={state.poll}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitError={submitError}
      initialData={lastSubmission}
    />
  )
}
