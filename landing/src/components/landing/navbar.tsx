"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="text-primary-foreground"
              >
                <rect x="2" y="8" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.5" />
                <rect x="7.5" y="4" width="3" height="12" rx="1.5" fill="currentColor" opacity="0.75" />
                <rect x="13" y="2" width="3" height="14" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground font-[family-name:var(--font-heading)]">
              PulseBoard
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="text-[15px] font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Use Cases
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </button>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton signUpForceRedirectUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL} />
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_DASHBOARD_URL}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
                >
                  Dashboard
                </a>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </div>
            </Show>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </button>
            <button
              className="p-2 text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <a
              href="#features"
              className="block text-[15px] font-medium text-muted-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-[15px] font-medium text-muted-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="block text-[15px] font-medium text-muted-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              Use Cases
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Show when="signed-out">
                <SignInButton signUpForceRedirectUrl={process.env.NEXT_PUBLIC_DASHBOARD_URL} />
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground"
                >
                  Get Started
                </Link>
              </Show>
              <Show when="signed-in">
                <a
                  href={process.env.NEXT_PUBLIC_DASHBOARD_URL}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground"
                >
                  Dashboard
                </a>
                <div className="flex justify-center py-2">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
