import { useLocation } from "react-router-dom"
import { Moon, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/polls/create": "Create Poll",
  "/settings": "Settings",
}

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]

  // Match dynamic poll routes
  const pollMatch = pathname.match(/^\/polls\/[^/]+\/?(.*)$/)
  if (pollMatch) {
    const sub = pollMatch[1]
    if (sub === "edit") return "Edit Poll"
    if (sub === "analytics") return "Analytics"
    if (sub === "live") return "Live View"
    if (sub === "responses") return "Responses"
    return "Poll Details"
  }

  return "PulseBoard"
}

export function Topbar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const title = getPageTitle(location.pathname)

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="font-heading text-sm font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </div>
    </header>
  )
}
