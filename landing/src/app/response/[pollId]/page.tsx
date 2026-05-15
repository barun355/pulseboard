import { PollResponsePage } from "@/components/response/poll-response-page"

export default async function ResponsePage({
  params,
}: {
  params: Promise<{ pollId: string }>
}) {
  const { pollId } = await params

  return <PollResponsePage pollId={pollId} />
}
