import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Topbar } from "./topbar"
import { Toaster } from "@/components/ui/sonner"
import { useEffect } from "react"
import { useAuth } from "@clerk/react"
import { CLERK_URLS } from "@/lib/constants"
import { initApiClient } from "@/api/client"

export function DashboardLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth()

  useEffect(() => {
    initApiClient(getToken)
  }, [getToken])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = CLERK_URLS.signInUrl
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  )
}
