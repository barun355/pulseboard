"use client";

import { Reveal, StaggerParent, StaggerChild } from "./reveal";
import { CountUp, AnimatedBar } from "./animated-mockup";

const steps = [
  {
    step: 1,
    title: "Create Your Poll",
    description:
      "Give your poll a title, add questions with options, mark which ones are mandatory, choose anonymous or authenticated mode, and set an expiry date.",
    mockup: (
      <div className="rounded-2xl bg-pb-nested p-5 space-y-3">
        <div className="h-4 w-48 rounded-full bg-pb-skeleton" />
        <div className="h-3 w-64 rounded-full bg-pb-separator" />
        <div className="mt-4 space-y-2.5">
          {["Which feature?", "How often?"].map((q) => (
            <div
              key={q}
              className="rounded-xl bg-card border border-border p-4"
            >
              <div className="text-sm font-medium text-foreground mb-2">{q}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-[#3B82F6] dark:border-[#60A5FA] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#3B82F6] dark:bg-[#60A5FA]" />
                  </div>
                  <div className="h-2.5 w-24 rounded-full bg-pb-skeleton" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-input" />
                  <div className="h-2.5 w-32 rounded-full bg-pb-skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-[#EFF6FF] dark:bg-[#172242] px-3 py-1.5">
            <div className="h-3 w-3 rounded bg-[#3B82F6]/30 dark:bg-[#60A5FA]/30" />
            <span className="text-xs text-[#3B82F6] dark:text-[#60A5FA] font-medium">Anonymous</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-[#FFF7ED] dark:bg-[#2C1E10] px-3 py-1.5">
            <div className="h-3 w-3 rounded bg-[#F97316]/30 dark:bg-[#FB923C]/30" />
            <span className="text-xs text-[#F97316] dark:text-[#FB923C] font-medium">Expires in 7d</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: 2,
    title: "Share the Link",
    description:
      "Get a unique shareable link. Use our pre-tagged UTM links to track exactly which platform brings the most responses.",
    mockup: (
      <div className="rounded-2xl bg-pb-nested p-5 space-y-3">
        <div className="text-sm font-medium text-foreground mb-1">Share your poll</div>
        <div className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5">
          <div className="h-2 w-2 rounded-full bg-[#22C55E] dark:bg-[#4ADE80]" />
          <span className="text-xs text-muted-foreground flex-1 truncate font-mono">
            pulseboard.app/poll/product-survey
          </span>
          <span className="text-xs font-medium text-[#3B82F6] dark:text-[#60A5FA] cursor-pointer">Copy</span>
        </div>
        <div className="text-xs font-medium text-pb-tertiary mt-2">UTM-tagged links</div>
        <div className="space-y-1.5">
          {[
            { platform: "Twitter", color: "#1DA1F2", tag: "utm_source=twitter" },
            { platform: "WhatsApp", color: "#25D366", tag: "utm_source=whatsapp" },
            { platform: "Email", color: "#F97316", tag: "utm_source=email" },
            { platform: "LinkedIn", color: "#0A66C2", tag: "utm_source=linkedin" },
          ].map((p) => (
            <div
              key={p.platform}
              className="flex items-center justify-between rounded-lg bg-card border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded-md flex items-center justify-center text-primary-foreground text-[10px] font-bold"
                  style={{ background: p.color }}
                >
                  {p.platform[0]}
                </div>
                <span className="text-xs text-foreground font-medium">{p.platform}</span>
              </div>
              <span className="text-[10px] text-[#3B82F6] dark:text-[#60A5FA] font-medium cursor-pointer">Copy</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: "Collect Responses Live",
    description:
      "Respondents open the link, answer questions, and submit. You see every response on your dashboard the moment it's submitted.",
    mockup: (
      <div className="rounded-2xl bg-pb-nested p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">Live responses</div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#F0FDF4] dark:bg-[#0F2E1D] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] dark:bg-[#4ADE80] animate-pulse" />
            <span className="text-[11px] font-medium text-[#16A34A] dark:text-[#4ADE80]">3 new</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { time: "2s ago", answer: "Option A", device: "Mobile" },
            { time: "15s ago", answer: "Option B", device: "Desktop" },
            { time: "1m ago", answer: "Option A", device: "Mobile" },
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-card border border-border px-4 py-2.5"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-[10px] text-pb-tertiary">A</span>
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{r.answer}</div>
                  <div className="text-[10px] text-pb-tertiary">{r.device}</div>
                </div>
              </div>
              <span className="text-[10px] text-pb-tertiary">{r.time}</span>
            </div>
          ))}
        </div>
        <div className="h-2 w-full rounded-full bg-pb-skeleton overflow-hidden">
          <AnimatedBar percentage={65} className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] dark:from-[#60A5FA] dark:to-[#A78BFA]" />
        </div>
        <div className="text-[10px] text-pb-tertiary text-center">65% completed</div>
      </div>
    ),
  },
  {
    step: 4,
    title: "Analyze & Publish Results",
    description:
      "View total responses, question-wise breakdowns, audience demographics, and traffic sources. Publish results so anyone can see the outcome.",
    mockup: (
      <div className="rounded-2xl bg-pb-nested p-5 space-y-3">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Responses", end: 247, suffix: "", decimals: 0, color: "#3B82F6" },
            { label: "Completion", end: 89, suffix: "%", decimals: 0, color: "#22C55E" },
            { label: "Avg. Time", end: 45, suffix: "s", decimals: 0, color: "#8B5CF6" },
            { label: "Rating", end: 4.2, suffix: "", decimals: 1, color: "#F97316" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-3">
              <div className="text-[10px] text-pb-tertiary">{s.label}</div>
              <div className="text-lg font-bold" style={{ color: s.color }}>
                <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
              </div>
            </div>
          ))}
        </div>
        {/* Mini bar chart */}
        <div className="space-y-1.5">
          {[
            { label: "Option A", pct: 45, color: "#3B82F6" },
            { label: "Option B", pct: 30, color: "#8B5CF6" },
            { label: "Option C", pct: 25, color: "#22C55E" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-14 truncate">{b.label}</span>
              <div className="flex-1 h-3 rounded-full bg-pb-separator overflow-hidden">
                <AnimatedBar percentage={b.pct} color={b.color} />
              </div>
              <span className="text-[10px] font-medium text-foreground w-8 text-right">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
        {/* Publish button */}
        <div className="flex justify-center pt-1">
          <div className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
            Publish Results
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-28 bg-card">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-pb-tertiary">
              HOW IT WORKS
            </span>
            <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground font-[family-name:var(--font-heading)]">
              From Question to Insight in 4 Steps
            </h2>
          </div>
        </Reveal>

        {/* Steps */}
        <StaggerParent stagger={0.15} className="space-y-20 md:space-y-28">
          {steps.map((s, i) => (
            <StaggerChild key={s.step}>
              <div
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10 md:gap-16`}
              >
                {/* Text */}
                <div className="flex-1 max-w-md">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-2xl md:text-[28px] font-bold tracking-[-0.02em] text-foreground font-[family-name:var(--font-heading)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
                {/* Mockup */}
                <Reveal direction="right" delay={0.2} className="flex-1 w-full max-w-md">
                  <div className="rounded-[24px] border border-border bg-card p-3 shadow-mockup">
                    {s.mockup}
                  </div>
                </Reveal>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>

        {/* Mid-page CTA */}
        <Reveal delay={0.1}>
          <div className="mt-20 text-center">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-[16px] font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
            >
              Create Your First Poll — Free
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
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
