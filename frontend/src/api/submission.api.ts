import { apiClient } from "./client"
import type { SubmissionRaw, ResponseDetail, Submission } from "@/types"

export interface SubmitResponsePayload {
  answers: { questionId: string; optionId: string }[]
  feedback?: string
  rating?: number
}

function toResponseDetail(raw: SubmissionRaw): ResponseDetail {
  const meta = raw.submissionMetaData
  const submittedAt = meta?.submittedAt ?? raw.createdAt
  const startedAt = meta?.startedAt ?? raw.createdAt
  const timeSpentSeconds = Math.round(
    (new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000,
  )

  return {
    id: raw.id,
    respondent: raw.user?.fullName || raw.user?.email || "Anonymous",
    rating: raw.rating,
    feedback: raw.feedback,
    isCompleted: raw.isCompleted,
    submittedAt,
    answers: raw.submissionAnswers.map((a) => ({
      questionId: a.questionId,
      questionTitle: a.question.title,
      questionOrder: a.question.order,
      optionId: a.optionId,
      optionName: a.option?.name ?? null,
    })),
    meta: {
      deviceType: meta?.deviceType ?? "Unknown",
      browser: meta?.browser ?? "Unknown",
      os: meta?.os ?? "Unknown",
      locale: meta?.locale ?? "",
      timezone: meta?.timezone ?? "",
      referrer: meta?.referrer ?? null,
      utmSource: meta?.utmSource ?? null,
      utmMedium: meta?.utmMedium ?? null,
      screenResolution: meta?.screenResolution ?? null,
      timeSpentSeconds: Math.max(0, timeSpentSeconds),
    },
  }
}

export const submissionApi = {
  getByPollId: async (pollId: string): Promise<ResponseDetail[]> => {
    const raw = await apiClient<SubmissionRaw[]>(`/poll/${pollId}/submissions`)
    return raw.map(toResponseDetail)
  },

  getResults: (pollId: string) =>
    apiClient<Submission>(`/poll/${pollId}/results`),

  submit: (pollId: string, data: SubmitResponsePayload) =>
    apiClient<Submission>(`/poll/${pollId}/response`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
