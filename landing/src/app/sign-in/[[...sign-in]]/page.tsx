import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PulseBoard account.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <SignIn
        forceRedirectUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL}
        signUpUrl="/sign-up"
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
