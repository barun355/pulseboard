import { Copy, Check, Link, Lock, AtSign, Briefcase, Mail, MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type { LucideIcon } from "lucide-react"
import type { Poll } from "@/types"
import { FRONTEND_URL } from "@/lib/constants"

interface SharePollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  poll: Poll
}

interface UtmPlatform {
  name: string
  key: string
  icon: LucideIcon
  source: string
  medium: string
}

const UTM_PLATFORMS: UtmPlatform[] = [
  { name: "Twitter / X", key: "twitter", icon: AtSign, source: "twitter", medium: "social" },
  { name: "WhatsApp", key: "whatsapp", icon: MessageCircle, source: "whatsapp", medium: "chat" },
  { name: "Email", key: "email", icon: Mail, source: "email", medium: "email" },
  { name: "LinkedIn", key: "linkedin", icon: Briefcase, source: "linkedin", medium: "social" },
]

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean
  onClick: () => void
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="shrink-0 gap-1.5"
      onClick={onClick}
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="size-3.5" />
          Copy
        </>
      )}
    </Button>
  )
}

export function SharePollDialog({
  open,
  onOpenChange,
  poll,
}: SharePollDialogProps) {
  const { copy, isCopied } = useCopyToClipboard()

  const baseUrl = `${FRONTEND_URL}/response/${poll.id}?slug=${poll.slug}`

  function utmUrl(platform: UtmPlatform) {
    return `${baseUrl}&utm_source=${platform.source}&utm_medium=${platform.medium}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share &ldquo;{poll.title}&rdquo;</DialogTitle>
          <DialogDescription>
            Copy the poll link or use UTM-tagged links to track where your
            responses come from.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Poll Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Poll Link</label>
            <div className="flex md:flex-row flex-col md:items-center items-start gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                <Link className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm">{baseUrl.slice(0, 30)}{baseUrl.length > 30 ? "..." : ""}</span>
              </div>
              <CopyButton
                copied={isCopied("base")}
                onClick={() => copy(baseUrl, "base")}
              />
            </div>
          </div>

          <Separator />

          {/* UTM-Tagged Links */}
          <div className="space-y-2">
            <label className="text-sm font-medium">UTM-Tagged Links</label>
            <div className="space-y-2">
              {UTM_PLATFORMS.map((platform) => {
                const url = utmUrl(platform)
                const Icon = platform.icon
                return (
                  <div
                    key={platform.key}
                    className="flex items-center gap-2"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="shrink-0 text-sm font-medium">
                        {platform.name}
                      </span>
                    </div>
                    <CopyButton
                      copied={isCopied(platform.key)}
                      onClick={() => copy(url, platform.key)}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Access Code (private polls only) */}
          {!poll.isPublic && poll.accessCode && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Access Code</label>
                <p className="text-xs text-muted-foreground">
                  Share this code privately with your intended respondents.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
                    <Lock className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-mono text-sm font-semibold tracking-widest">
                      {poll.accessCode}
                    </span>
                  </div>
                  <CopyButton
                    copied={isCopied("access-code")}
                    onClick={() => copy(poll.accessCode!, "access-code")}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
