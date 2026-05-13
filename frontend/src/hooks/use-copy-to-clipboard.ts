import { useState, useCallback, useRef } from "react"

export function useCopyToClipboard(resetDelay = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const copy = useCallback(
    async (text: string, key: string) => {
      await navigator.clipboard.writeText(text)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setCopiedKey(key)
      timeoutRef.current = setTimeout(() => setCopiedKey(null), resetDelay)
    },
    [resetDelay]
  )

  const isCopied = useCallback(
    (key: string) => copiedKey === key,
    [copiedKey]
  )

  return { copy, isCopied }
}
