"use client"

import { useState } from "react"
import { Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccessCodeGateProps {
  onSubmit: (code: string) => void
  isPending: boolean
  error: string | null
}

export function AccessCodeGate({ onSubmit, isPending, error }: AccessCodeGateProps) {
  const [code, setCode] = useState("")

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-ambient text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <Lock className="size-5 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-lg font-semibold mb-1">
          Private Poll
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the access code to view this poll.
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => {
            const value = e.target.value
              .replace(/[^a-zA-Z0-9]/g, "")
              .toUpperCase()
              .slice(0, 6)
            setCode(value)
          }}
          placeholder="e.g. A1B2C3"
          maxLength={6}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center font-mono text-lg tracking-widest uppercase placeholder:text-muted-foreground placeholder:text-sm placeholder:tracking-normal placeholder:font-sans focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
        />

        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}

        <Button
          className="mt-4 w-full"
          disabled={code.length === 0 || isPending}
          onClick={() => onSubmit(code)}
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? "Verifying..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
