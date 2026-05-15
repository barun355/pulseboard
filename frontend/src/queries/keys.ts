export const pollKeys = {
  all: ["polls"] as const,
  lists: () => [...pollKeys.all, "list"] as const,
  details: () => [...pollKeys.all, "detail"] as const,
  detail: (pollId: string) => [...pollKeys.details(), pollId] as const,
}

export const analyticsKeys = {
  all: ["analytics"] as const,
  poll: (pollId: string) => [...analyticsKeys.all, "poll", pollId] as const,
}

export const submissionKeys = {
  all: ["submissions"] as const,
  byPoll: (pollId: string) =>
    [...submissionKeys.all, "poll", pollId] as const,
}
