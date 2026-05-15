export type PollStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "PUBLISHED"

export interface Poll {
  id: string
  slug: string
  title: string
  description: string | null
  status: PollStatus
  isPublic: boolean
  isAnonymousSubmissionAllowed: boolean
  isAllowedToEditAfterResponse: boolean
  accessCode: string | null
  expiresAt: string
  createdAt: string
  updatedAt: string
  createdById: string
}

export interface PollWithCounts extends Poll {
  _count: {
    submissions: number
    questions: number
  }
}

export interface Question {
  id: string
  pollId: string
  title: string
  description: string | null
  order: number
  isOptional: boolean
  createdAt: string
  updatedAt: string
}

export interface Option {
  id: string
  questionId: string
  name: string
  value: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface QuestionWithOptions extends Question {
  options: Option[]
}

export interface PollWithQuestions extends Poll {
  questions: QuestionWithOptions[]
}

export interface Submission {
  id: string
  submittedBy: string | null
  pollId: string
  feedback: string | null
  rating: number | null
  isCompleted: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// ── Analytics ──

export interface AnalyticsOverview {
  totalResponses: number
  completionRate: number
  avgTimeSeconds: number
  avgRating: number
}

export interface TrendDataPoint {
  date: string
  count: number
}

export interface QuestionOptionBreakdown {
  optionId: string
  name: string
  count: number
  pct: number
}

export interface QuestionBreakdown {
  questionId: string
  title: string
  totalResponses: number
  skipCount: number
  options: QuestionOptionBreakdown[]
}

export interface AudienceData {
  devices: Record<string, number>
  browsers: Record<string, number>
  os: Record<string, number>
  locales: Record<string, number>
}

export interface SourceBreakdown {
  source: string
  medium: string
  count: number
}

export interface FeedbackComment {
  rating: number
  text: string
  submittedAt: string
}

export interface FeedbackData {
  ratings: Record<string, number>
  comments: FeedbackComment[]
}

export interface HeatmapDataPoint {
  day: number
  hour: number
  count: number
}

export interface PollAnalyticsData {
  overview: AnalyticsOverview
  trend: TrendDataPoint[]
  questions: QuestionBreakdown[]
  audience: AudienceData
  sources: SourceBreakdown[]
  feedback: FeedbackData
  heatmap: HeatmapDataPoint[]
}

// ── Live / Socket ──

export interface LiveResponseEvent {
  submissionId: string
  respondent: string
  questionsAnswered: number
  totalQuestions: number
  answers: {
    questionId: string
    optionId: string | null
  }[]
  submittedAt: string
}

export interface LiveQuestionState {
  questionId: string
  title: string
  options: {
    optionId: string
    name: string
    count: number
  }[]
  totalResponses: number
}

export interface LiveTrendPoint {
  time: string
  count: number
}

// ── Responses ──

export interface SubmissionAnswerDetail {
  questionId: string
  questionTitle: string
  questionOrder: number
  optionId: string | null
  optionName: string | null
}

export interface SubmissionMeta {
  deviceType: string
  browser: string
  os: string
  locale: string
  timezone: string
  referrer: string | null
  utmSource: string | null
  utmMedium: string | null
  screenResolution: string | null
  timeSpentSeconds: number
}

export interface ResponseDetail {
  id: string
  respondent: string
  rating: number | null
  feedback: string | null
  isCompleted: boolean
  submittedAt: string
  answers: SubmissionAnswerDetail[]
  meta: SubmissionMeta
}
