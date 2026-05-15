import { apiClient } from "./client"
import type { PollAnalyticsData } from "@/types"

export const analyticsApi = {
  getByPollId: (pollId: string) =>
    apiClient<PollAnalyticsData>(`/poll/${pollId}/analytics`),
}
