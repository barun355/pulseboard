import { useEffect, useRef, useState, useCallback } from "react"
import { getSocket } from "@/services/socket"
import type { LiveResponseEvent, QuestionWithOptions } from "@/types"

type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

interface UsePollSocketOptions {
  pollId: string
  questions: QuestionWithOptions[]
  onNewResponse: (event: LiveResponseEvent) => void
}

const USE_MOCK = import.meta.env.VITE_MOCK_SOCKET !== "false"

function generateMockResponse(questions: QuestionWithOptions[]): LiveResponseEvent {
  const isAnonymous = Math.random() > 0.3
  const totalQ = questions.length
  const answered = Math.random() > 0.1 ? totalQ : Math.max(1, totalQ - 1)

  return {
    submissionId: crypto.randomUUID(),
    respondent: isAnonymous
      ? "Anonymous"
      : `user${Math.floor(Math.random() * 100)}@example.com`,
    questionsAnswered: answered,
    totalQuestions: totalQ,
    answers: questions.slice(0, answered).map((q) => ({
      questionId: q.id,
      optionId:
        q.options[Math.floor(Math.random() * q.options.length)]?.id ?? null,
    })),
    submittedAt: new Date().toISOString(),
  }
}

export function usePollSocket({
  pollId,
  questions,
  onNewResponse,
}: UsePollSocketOptions) {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected")
  const onNewResponseRef = useRef(onNewResponse)
  onNewResponseRef.current = onNewResponse
  const questionsRef = useRef(questions)
  questionsRef.current = questions

  const startMock = useCallback(() => {
    setConnectionStatus("connected")

    function scheduleNext() {
      const delay = 3000 + Math.random() * 5000
      return window.setTimeout(() => {
        if (questionsRef.current.length > 0) {
          onNewResponseRef.current(
            generateMockResponse(questionsRef.current)
          )
        }
        timerRef.current = scheduleNext()
      }, delay)
    }

    const timerRef = { current: scheduleNext() }
    return () => {
      clearTimeout(timerRef.current)
      setConnectionStatus("disconnected")
    }
  }, [])

  useEffect(() => {
    if (USE_MOCK) {
      return startMock()
    }

    const socket = getSocket()

    function handleConnect() {
      setConnectionStatus("connected")
      socket.emit("join-poll", { pollId })
    }

    function handleDisconnect() {
      setConnectionStatus("disconnected")
    }

    function handleReconnectAttempt() {
      setConnectionStatus("reconnecting")
    }

    function handleNewResponse(event: LiveResponseEvent) {
      onNewResponseRef.current(event)
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.io.on("reconnect_attempt", handleReconnectAttempt)
    socket.on("new-response", handleNewResponse)

    socket.connect()

    if (socket.connected) {
      setConnectionStatus("connected")
      socket.emit("join-poll", { pollId })
    }

    return () => {
      socket.emit("leave-poll", { pollId })
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.io.off("reconnect_attempt", handleReconnectAttempt)
      socket.off("new-response", handleNewResponse)
      socket.disconnect()
      setConnectionStatus("disconnected")
    }
  }, [pollId, startMock])

  return { connectionStatus }
}
