import { useMutation, useQueryClient } from "@tanstack/react-query"
import { pollApi } from "@/api/poll.api"
import type {
  CreatePollPayload,
  AddQuestionPayload,
  UpdateQuestionPayload,
  UpdateOptionsPayload,
  AddOptionsPayload,
  UpdateQuestionOrderPayload,
} from "@/api/poll.api"

import { pollKeys } from "@/queries/keys"
import type { PollStatus } from "@/types"

export function useCreatePoll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePollPayload) => pollApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollKeys.lists() })
    },
  })
}

export function useUpdatePollStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pollId, status }: { pollId: string; status: PollStatus }) =>
      pollApi.updateStatus(pollId, status),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
      queryClient.invalidateQueries({ queryKey: pollKeys.lists() })
    },
  })
}

export function useAddQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      data,
    }: {
      pollId: string
      data: AddQuestionPayload
    }) => pollApi.addQuestion(pollId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      data,
    }: {
      pollId: string
      data: UpdateQuestionPayload
    }) => pollApi.updateQuestion(pollId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pollId, questionId }: { pollId: string; questionId: string }) =>
      pollApi.deleteQuestion(pollId, questionId),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useDeleteOption() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      questionId,
      optionId,
    }: {
      pollId: string
      questionId: string
      optionId: string
    }) => pollApi.deleteOption(pollId, questionId, optionId),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useUpdateOptions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      questionId,
      data,
    }: {
      pollId: string
      questionId: string
      data: UpdateOptionsPayload
    }) => pollApi.updateOptions(pollId, questionId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useAddOptions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      questionId,
      data,
    }: {
      pollId: string
      questionId: string
      data: AddOptionsPayload
    }) => pollApi.addOptions(pollId, questionId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

export function useUpdateQuestionOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      data,
    }: {
      pollId: string
      data: UpdateQuestionOrderPayload
    }) => pollApi.updateQuestionOrder(pollId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}
