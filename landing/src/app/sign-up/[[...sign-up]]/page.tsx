import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free PulseBoard account and start building polls in seconds.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <SignUp
        forceRedirectUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL}
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            cardBox: "shadow-ambient rounded-[20px]",
          },
        }}
      />
    </div>
  );
}
