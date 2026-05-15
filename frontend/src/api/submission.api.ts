import { apiClient } from "./client"
import type { ResponseDetail, Submission } from "@/types"

export interface SubmitResponsePayload {
  answers: { questionId: string; optionId: string }[]
  feedback?: string
  rating?: number
}

export const submissionApi = {
  getByPollId: (pollId: string) =>
    apiClient<ResponseDetail[]>(`/poll/${pollId}/submissions`),

  getResults: (pollId: string) =>
    apiClient<Submission>(`/poll/${pollId}/results`),

  submit: (pollId: string, data: SubmitResponsePayload) =>
    apiClient<Submission>(`/poll/${pollId}/response`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
