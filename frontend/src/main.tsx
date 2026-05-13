import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
