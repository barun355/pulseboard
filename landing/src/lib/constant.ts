
const CLERK_URLS = {
    afterSignInUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:5173",
    afterSignUpUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:5173",
    afterSignOutUrl: process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "http://localhost:3000",
}

export { CLERK_URLS }