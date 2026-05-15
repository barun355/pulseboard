import { queryOptions } from "@tanstack/react-query"
import { pollApi } from "@/api/poll.api"
import { pollKeys } from "./keys"

export const pollQueries = {
  list: () =>
    queryOptions({
      queryKey: pollKeys.lists(),
      queryFn: () => pollApi.getAll(),
    }),

  detail: (pollId: string) =>
    queryOptions({
      queryKey: pollKeys.detail(pollId),
      queryFn: () => pollApi.getById(pollId),
      enabled: !!pollId,
    }),
}
