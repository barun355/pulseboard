
const CLERK_URLS = {
    afterSignInUrl: process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "http://localhost:3000",
    afterSignUpUrl: process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "http://localhost:3000",
    afterSignOutUrl: process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "http://localhost:3000",
}

export { CLERK_URLS }