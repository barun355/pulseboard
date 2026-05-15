import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Dashboard } from "@/pages/dashboard"
import { CreatePoll } from "@/pages/create-poll"
import { PollDetail } from "@/pages/poll-detail"
import { EditPoll } from "@/pages/edit-poll"
import { PollAnalytics } from "@/pages/poll-analytics"
import { PollLive } from "@/pages/poll-live"
import { PollResponses } from "@/pages/poll-responses"
import { SettingsPage } from "@/pages/settings"
import { ClerkProvider } from "@clerk/react"
import { CLERK_URLS } from "./lib/constants"
import { queryClient } from "@/queries/query-client"

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "polls/create", element: <CreatePoll /> },
      { path: "polls/:pollId", element: <PollDetail /> },
      { path: "polls/:pollId/edit", element: <EditPoll /> },
      { path: "polls/:pollId/analytics", element: <PollAnalytics /> },
      { path: "polls/:pollId/live", element: <PollLive /> },
      { path: "polls/:pollId/responses", element: <PollResponses /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
])

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ""

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl={CLERK_URLS.afterSignOutUrl}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
)
