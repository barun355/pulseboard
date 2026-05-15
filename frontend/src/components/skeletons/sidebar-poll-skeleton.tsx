import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function SidebarPollSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SidebarMenu>
      {Array.from({ length: count }).map((_, i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuButton>
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </SidebarMenuButton>
          <SidebarMenuBadge>
            <Skeleton className="h-4 w-12 rounded-full" />
          </SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
