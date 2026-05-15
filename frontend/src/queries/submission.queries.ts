import { queryOptions } from "@tanstack/react-query"
import { submissionApi } from "@/api/submission.api"
import { submissionKeys } from "./keys"

export const submissionQueries = {
  byPoll: (pollId: string) =>
    queryOptions({
      queryKey: submissionKeys.byPoll(pollId),
      queryFn: () => submissionApi.getByPollId(pollId),
      enabled: !!pollId,
    }),
}
