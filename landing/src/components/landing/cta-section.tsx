"use client";

import Link from "next/link";
import { Reveal } from "./reveal";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-card">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, #BFDBFE 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #A7F3D0 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-[48px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground font-[family-name:var(--font-heading)]">
            Ready to Hear What Your
            <br />
            Audience Thinks?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-lg text-muted-foreground max-w-[500px] mx-auto">
            Create your first poll in under 60 seconds. Free. No credit card.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-[16px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
            >
              Get Started — It&apos;s Free
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <a
            href="#"
            className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Or explore a sample poll
          </a>
        </Reveal>
      </div>
    </section>
  );
}
