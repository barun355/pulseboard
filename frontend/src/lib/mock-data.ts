import type {
  PollWithCounts,
  QuestionWithOptions,
  PollAnalyticsData,
  ResponseDetail,
} from "@/types"

export const MOCK_POLLS: PollWithCounts[] = [
  {
    id: "1",
    slug: "product-feature-survey",
    title: "Product Feature Survey",
    description: "Help us decide which features to build next for our platform.",
    status: "ACTIVE",
    isPublic: true,
    isAnonymousSubmissionAllowed: true,
    isAllowedToEditAfterResponse: false,
    accessCode: null,
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: "user-1",
    _count: { submissions: 234, questions: 5 },
  },
  {
    id: "2",
    slug: "team-satisfaction-q2",
    title: "Team Satisfaction Q2",
    description: "Quarterly team satisfaction and engagement survey.",
    status: "DRAFT",
    isPublic: false,
    isAnonymousSubmissionAllowed: true,
    isAllowedToEditAfterResponse: false,
    accessCode: "TEAM-Q2",
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: "user-1",
    _count: { submissions: 0, questions: 8 },
  },
  {
    id: "3",
    slug: "community-topic-vote",
    title: "Community Topic Vote",
    description: "Vote on the topics you want covered in our next community meetup.",
    status: "CLOSED",
    isPublic: true,
    isAnonymousSubmissionAllowed: false,
    isAllowedToEditAfterResponse: false,
    accessCode: null,
    expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: "user-1",
    _count: { submissions: 89, questions: 3 },
  },
  {
    id: "4",
    slug: "q2-retro-feedback",
    title: "Q2 Retro Feedback",
    description: "Share your thoughts on what went well and what we can improve.",
    status: "PUBLISHED",
    isPublic: true,
    isAnonymousSubmissionAllowed: true,
    isAllowedToEditAfterResponse: true,
    accessCode: null,
    expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: "user-1",
    _count: { submissions: 156, questions: 6 },
  },
  {
    id: "5",
    slug: "onboarding-experience",
    title: "Onboarding Experience",
    description: null,
    status: "ACTIVE",
    isPublic: false,
    isAnonymousSubmissionAllowed: false,
    isAllowedToEditAfterResponse: false,
    accessCode: "ONBOARD",
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdById: "user-1",
    _count: { submissions: 42, questions: 4 },
  },
]

const ts = new Date().toISOString()

function mockOption(
  id: string,
  questionId: string,
  order: number,
  name: string,
  value: string
) {
  return { id, questionId, order, name, value, createdAt: ts, updatedAt: ts }
}

function mockQuestion(
  id: string,
  pollId: string,
  order: number,
  title: string,
  isOptional: boolean,
  options: ReturnType<typeof mockOption>[]
): QuestionWithOptions {
  return {
    id,
    pollId,
    order,
    title,
    description: null,
    isOptional,
    createdAt: ts,
    updatedAt: ts,
    options,
  }
}

export const MOCK_QUESTIONS: Record<string, QuestionWithOptions[]> = {
  "1": [
    mockQuestion("q1-1", "1", 1, "Which feature matters most to you?", false, [
      mockOption("o1-1", "q1-1", 1, "Dark mode", "dark-mode"),
      mockOption("o1-2", "q1-1", 2, "API integrations", "api-integrations"),
      mockOption("o1-3", "q1-1", 3, "Mobile app", "mobile-app"),
      mockOption("o1-4", "q1-1", 4, "Team collaboration", "team-collaboration"),
    ]),
    mockQuestion("q1-2", "1", 2, "How often do you use our product?", false, [
      mockOption("o2-1", "q1-2", 1, "Daily", "daily"),
      mockOption("o2-2", "q1-2", 2, "Weekly", "weekly"),
      mockOption("o2-3", "q1-2", 3, "Monthly", "monthly"),
      mockOption("o2-4", "q1-2", 4, "Rarely", "rarely"),
    ]),
    mockQuestion("q1-3", "1", 3, "Any additional feedback?", true, [
      mockOption("o3-1", "q1-3", 1, "Yes, I have feedback", "yes"),
      mockOption("o3-2", "q1-3", 2, "No, everything is great", "no"),
    ]),
  ],
  "2": [
    mockQuestion(
      "q2-1",
      "2",
      1,
      "How satisfied are you with your work-life balance?",
      false,
      [
        mockOption("o4-1", "q2-1", 1, "Very satisfied", "very-satisfied"),
        mockOption("o4-2", "q2-1", 2, "Satisfied", "satisfied"),
        mockOption("o4-3", "q2-1", 3, "Neutral", "neutral"),
        mockOption("o4-4", "q2-1", 4, "Dissatisfied", "dissatisfied"),
      ]
    ),
    mockQuestion(
      "q2-2",
      "2",
      2,
      "Would you recommend this company to a friend?",
      false,
      [
        mockOption("o5-1", "q2-2", 1, "Definitely", "definitely"),
        mockOption("o5-2", "q2-2", 2, "Probably", "probably"),
        mockOption("o5-3", "q2-2", 3, "Not sure", "not-sure"),
        mockOption("o5-4", "q2-2", 4, "Unlikely", "unlikely"),
      ]
    ),
  ],
}

// ── Analytics mock data ──

function generateHeatmap() {
  const data: { day: number; hour: number; count: number }[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let base = 0
      if (hour >= 9 && hour <= 17) base = 4
      if (hour >= 13 && hour <= 16) base = 8
      if (day >= 5) base = Math.floor(base * 0.4)
      const count = Math.max(0, base + Math.floor(Math.random() * 4) - 1)
      data.push({ day, hour, count })
    }
  }
  return data
}

export const MOCK_ANALYTICS: Record<string, PollAnalyticsData> = {
  "1": {
    overview: {
      totalResponses: 234,
      completionRate: 87,
      avgTimeSeconds: 154,
      avgRating: 4.2,
    },
    trend: [
      { date: "2026-05-07", count: 18 },
      { date: "2026-05-08", count: 25 },
      { date: "2026-05-09", count: 42 },
      { date: "2026-05-10", count: 38 },
      { date: "2026-05-11", count: 51 },
      { date: "2026-05-12", count: 35 },
      { date: "2026-05-13", count: 25 },
    ],
    questions: [
      {
        questionId: "q1-1",
        title: "Which feature matters most to you?",
        totalResponses: 234,
        skipCount: 0,
        options: [
          { optionId: "o1-1", name: "Dark mode", count: 98, pct: 42 },
          { optionId: "o1-2", name: "API integrations", count: 66, pct: 28 },
          { optionId: "o1-3", name: "Mobile app", count: 42, pct: 18 },
          { optionId: "o1-4", name: "Team collaboration", count: 28, pct: 12 },
        ],
      },
      {
        questionId: "q1-2",
        title: "How often do you use our product?",
        totalResponses: 234,
        skipCount: 0,
        options: [
          { optionId: "o2-1", name: "Daily", count: 129, pct: 55 },
          { optionId: "o2-2", name: "Weekly", count: 59, pct: 25 },
          { optionId: "o2-3", name: "Monthly", count: 28, pct: 12 },
          { optionId: "o2-4", name: "Rarely", count: 18, pct: 8 },
        ],
      },
      {
        questionId: "q1-3",
        title: "Any additional feedback?",
        totalResponses: 234,
        skipCount: 47,
        options: [
          { optionId: "o3-1", name: "Yes, I have feedback", count: 140, pct: 75 },
          { optionId: "o3-2", name: "No, everything is great", count: 47, pct: 25 },
        ],
      },
    ],
    audience: {
      devices: { Mobile: 159, Desktop: 66, Tablet: 9 },
      browsers: { Chrome: 129, Safari: 59, Firefox: 28, Edge: 18 },
      os: { Android: 105, iOS: 54, Windows: 47, macOS: 19, Linux: 9 },
      locales: { "en-IN": 140, "en-US": 59, "en-GB": 23, Other: 12 },
    },
    sources: [
      { source: "Twitter", medium: "social", count: 105 },
      { source: "WhatsApp", medium: "chat", count: 70 },
      { source: "Email", medium: "email", count: 32 },
      { source: "LinkedIn", medium: "social", count: 12 },
      { source: "Direct", medium: "none", count: 15 },
    ],
    feedback: {
      ratings: { "1": 7, "2": 16, "3": 35, "4": 70, "5": 106 },
      comments: [
        { rating: 5, text: "Great survey! Really well thought out questions.", submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { rating: 4, text: "Needs more options for the feature question.", submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        { rating: 5, text: "Very relevant to what we need. Keep it up!", submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
        { rating: 3, text: "Too short. Would love deeper questions.", submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
        { rating: 5, text: "Perfect length and clear questions.", submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
        { rating: 2, text: "Didn't feel the options covered my use case.", submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    heatmap: generateHeatmap(),
  },
}

// ── Responses mock data ──

const devices = ["Desktop", "Mobile", "Tablet"]
const browsers = ["Chrome", "Safari", "Firefox", "Edge"]
const oses = ["Windows", "macOS", "Android", "iOS", "Linux"]
const locales = ["en-IN", "en-US", "en-GB", "de-DE"]
const timezones = ["Asia/Kolkata", "America/New_York", "Europe/London", "Europe/Berlin"]
const utmSources: (string | null)[] = ["twitter", "whatsapp", "email", "linkedin", null]
const utmMediums: Record<string, string> = { twitter: "social", whatsapp: "chat", email: "email", linkedin: "social" }

const feedbacks = [
  "Great survey! Really well thought out.",
  "Needs more options for the feature question.",
  "Very relevant to what we need.",
  "Too short. Would love deeper questions.",
  "Perfect length and clear questions.",
  null,
  null,
  null,
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateMockResponses(): ResponseDetail[] {
  const questions = MOCK_QUESTIONS["1"]
  if (!questions) return []

  return Array.from({ length: 24 }, (_, i) => {
    const isAnon = Math.random() > 0.35
    const source = pickRandom(utmSources)
    const hoursAgo = i * 3 + Math.floor(Math.random() * 3)
    const completed = Math.random() > 0.1
    const rating = Math.random() > 0.2 ? Math.ceil(Math.random() * 5) : null

    const answers = questions.map((q) => {
      const skipped = q.isOptional && Math.random() > 0.7
      const option = skipped
        ? null
        : pickRandom(q.options)

      return {
        questionId: q.id,
        questionTitle: q.title,
        questionOrder: q.order,
        optionId: option?.id ?? null,
        optionName: option?.name ?? null,
      }
    })

    return {
      id: `resp-${i + 1}`,
      respondent: isAnon
        ? "Anonymous"
        : `user${i + 1}@example.com`,
      rating,
      feedback: pickRandom(feedbacks),
      isCompleted: completed,
      submittedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      answers,
      meta: {
        deviceType: pickRandom(devices),
        browser: pickRandom(browsers),
        os: pickRandom(oses),
        locale: pickRandom(locales),
        timezone: pickRandom(timezones),
        referrer: source ? `https://${source}.com` : null,
        utmSource: source,
        utmMedium: source ? utmMediums[source] ?? null : null,
        screenResolution: pickRandom(["1920x1080", "1440x900", "390x844", "360x800"]),
        timeSpentSeconds: 60 + Math.floor(Math.random() * 180),
      },
    }
  })
}

export const MOCK_RESPONSES: Record<string, ResponseDetail[]> = {
  "1": generateMockResponses(),
}
