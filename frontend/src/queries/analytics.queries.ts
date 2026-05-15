import { queryOptions } from "@tanstack/react-query"
import { analyticsApi } from "@/api/analytics.api"
import { analyticsKeys } from "./keys"

export const analyticsQueries = {
  poll: (pollId: string) =>
    queryOptions({
      queryKey: analyticsKeys.poll(pollId),
      queryFn: () => analyticsApi.getByPollId(pollId),
      enabled: !!pollId,
    }),
}
