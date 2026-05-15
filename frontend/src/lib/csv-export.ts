import type { ResponseDetail, QuestionWithOptions } from "@/types"

function escapeCell(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function generateCsv(
  responses: ResponseDetail[],
  questions: QuestionWithOptions[]
): string {
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

  const questionHeaders = sortedQuestions.map(
    (q, i) => `Q${i + 1}: ${q.title}`
  )

  const headers = [
    "#",
    "Respondent",
    "Submitted At",
    "Rating",
    "Status",
    ...questionHeaders,
    "Feedback Text",
    "Device",
    "Browser",
    "OS",
    "Locale",
    "Timezone",
    "UTM Source",
    "UTM Medium",
    "Time Spent (s)",
  ]

  const rows = responses.map((r, idx) => {
    const answerCells = sortedQuestions.map((q) => {
      const answer = r.answers.find((a) => a.questionId === q.id)
      if (!answer || !answer.optionName) return "(skipped)"
      return answer.optionName
    })

    return [
      String(idx + 1),
      r.respondent,
      r.submittedAt,
      r.rating != null ? String(r.rating) : "",
      r.isCompleted ? "Completed" : "Partial",
      ...answerCells,
      r.feedback ?? "",
      r.meta.deviceType,
      r.meta.browser,
      r.meta.os,
      r.meta.locale,
      r.meta.timezone,
      r.meta.utmSource ?? "",
      r.meta.utmMedium ?? "",
      String(r.meta.timeSpentSeconds),
    ]
  })

  const csvContent = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\n")

  return "\uFEFF" + csvContent
}

export function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
