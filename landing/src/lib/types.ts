export interface Option {
  id: string
  name: string
  value: string
  order: number
}

export interface Question {
  id: string
  title: string
  description: string | null
  isOptional: boolean
  order: number
  options: Option[]
}

export interface Poll {
  id: string
  title: string
  description: string | null
  slug: string
  status: string
  isPublic: boolean
  isAnonymousSubmissionAllowed: boolean
  isAllowedToEditAfterResponse: boolean
  expiresAt: string
  questions: Question[]
}

export interface SubmitPayload {
  responses: { questionId: string; optionId: string | null }[]
  feedback: string | null
  rating: number | null
  accessCode?: string
  startedAt: string
  spendTimePerQuestion: Record<string, number>
  locale: string
  timezone: string
  screenResolution: string | null
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
}
