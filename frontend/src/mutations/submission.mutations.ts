import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submissionApi } from "@/api/submission.api"
import type { SubmitResponsePayload } from "@/api/submission.api"
import { submissionKeys, analyticsKeys } from "@/queries/keys"

export function useSubmitResponse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      pollId,
      data,
    }: {
      pollId: string
      data: SubmitResponsePayload
    }) => submissionApi.submit(pollId, data),
    onSuccess: (_data, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.byPoll(pollId) })
      queryClient.invalidateQueries({ queryKey: analyticsKeys.poll(pollId) })
    },
  })
}
