import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { PollStatusBadge } from "@/components/poll/poll-status-badge"
import { MOCK_POLLS } from "@/lib/mock-data"

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-heading text-sm font-semibold">
                    PulseBoard
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Poll Analytics
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/"}
                  tooltip="Dashboard"
                >
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/polls/create"}
                  tooltip="Create Poll"
                >
                  <Link to="/polls/create">
                    <Plus />
                    <span>Create Poll</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Dynamic poll list */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Your Polls</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MOCK_POLLS.map((poll) => (
                <SidebarMenuItem key={poll.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(`/polls/${poll.id}`)}
                    tooltip={poll.title}
                  >
                    <Link to={`/polls/${poll.id}`}>
                      <span className="truncate">{poll.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                    <PollStatusBadge status={poll.status} />
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/settings"}
              tooltip="Settings"
            >
              <Link to="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
