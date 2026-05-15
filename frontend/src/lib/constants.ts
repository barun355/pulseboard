
const CLERK_URLS = {
    signInUrl: import.meta.env.VITE_LANDING_PAGE_URL ? `${import.meta.env.VITE_LANDING_PAGE_URL}/sign-in` : "http://localhost:3000/sign-in",
    signUpUrl: import.meta.env.VITE_LANDING_PAGE_URL ? `${import.meta.env.VITE_LANDING_PAGE_URL}/sign-up` : "http://localhost:3000/sign-up",
    afterSignOutUrl: import.meta.env.VITE_LANDING_PAGE_URL || "http://localhost:3000",
}

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"


export { CLERK_URLS, FRONTEND_URL }