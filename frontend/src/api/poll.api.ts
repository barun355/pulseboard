import { apiClient } from "./client"
import type {
  Poll,
  PollWithCounts,
  PollWithQuestions,
  PollStatus,
  Question,
  QuestionWithOptions,
  Option,
} from "@/types"

export interface CreatePollPayload {
  slug: string
  title: string
  description: string
  isPublic: boolean
  expiresAt: string
  isAnonymousSubmissionAllowed: boolean
  isAllowedToEditAfterResponse: boolean
  isPublicResponseAnalyticsAllowed: boolean
  accessCode?: string
  createdById: string
}

export interface AddQuestionPayload {
  title: string
  description?: string
  isOptional: boolean
  order: number
  options?: { name: string; value: string; order: number }[]
}

export interface UpdateQuestionPayload {
  questionId: string
  title: string
  description?: string
  isOptional: boolean
}

export interface UpdateOptionsPayload {
  options: { id: string; name: string; value: string; order: number }[]
}

export interface AddOptionsPayload {
  options: { name: string; value: string; order: number }[]
}

export interface UpdateQuestionOrderPayload {
  questions: { id: string; order: number }[]
}

export const pollApi = {
  getAll: () => apiClient<PollWithCounts[]>("/poll"),

  getById: (pollId: string) =>
    apiClient<PollWithQuestions>(`/poll/${pollId}`),

  create: (data: CreatePollPayload) =>
    apiClient<Poll>("/poll", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (pollId: string, status: PollStatus) =>
    apiClient<Poll>(`/poll/${pollId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ pollId, status }),
    }),

  addQuestion: (pollId: string, data: AddQuestionPayload) =>
    apiClient<QuestionWithOptions>(`/poll/${pollId}/questions/add`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (pollId: string, data: UpdateQuestionPayload) =>
    apiClient<Question>(`/poll/${pollId}/questions/update`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteQuestion: (pollId: string, questionId: string) =>
    apiClient<{ questionId: string }>(`/poll/${pollId}/questions/${questionId}`, {
      method: "DELETE",
    }),

  deleteOption: (pollId: string, questionId: string, optionId: string) =>
    apiClient<{ optionId: string }>(
      `/poll/${pollId}/questions/${questionId}/option/${optionId}`,
      { method: "DELETE" },
    ),

  updateOptions: (pollId: string, questionId: string, data: UpdateOptionsPayload) =>
    apiClient<Option[]>(
      `/poll/${pollId}/questions/${questionId}/option/updated`,
      { method: "PATCH", body: JSON.stringify(data) },
    ),

  addOptions: (pollId: string, questionId: string, data: AddOptionsPayload) =>
    apiClient<Option[]>(
      `/poll/${pollId}/questions/${questionId}/options/add`,
      { method: "POST", body: JSON.stringify(data) },
    ),

  updateQuestionOrder: (pollId: string, data: UpdateQuestionOrderPayload) =>
    apiClient<Question[]>(`/poll/${pollId}/questions/order`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}
