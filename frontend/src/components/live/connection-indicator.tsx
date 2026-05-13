import { cn } from "@/lib/utils"

type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

interface ConnectionIndicatorProps {
  status: ConnectionStatus
}

const config: Record<ConnectionStatus, { color: string; label: string; animate?: string }> = {
  connected: { color: "bg-green-500", label: "Connected", animate: "animate-pulse" },
  disconnected: { color: "bg-red-500", label: "Disconnected" },
  reconnecting: { color: "bg-yellow-500", label: "Reconnecting...", animate: "animate-pulse" },
}

export function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  const { color, label, animate } = config[status]

  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-2 rounded-full", color, animate)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
