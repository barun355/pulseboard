import { useParams } from "react-router-dom"

export function PollResponses() {
  const { pollId } = useParams()

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Responses
      </h2>
      <p className="text-muted-foreground">
        Individual responses for poll: {pollId}
      </p>
    </div>
  )
}
