"use client";

import { Reveal, StaggerParent, StaggerChild } from "./reveal";

const valuePoints = [
  {
    title: "Reduce decision-making time by 10x",
    description:
      "Instead of week-long email threads and meetings, get definitive answers from your audience in hours. Data-driven decisions, not opinion wars.",
    icon: (
      <svg className="h-5 w-5 text-[#3B82F6] dark:text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Understand your audience without surveys",
    description:
      "Automatic metadata capture gives you demographic insights without adding a single extra question. Higher completion rates, richer data.",
    icon: (
      <svg className="h-5 w-5 text-[#22C55E] dark:text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Know which channels actually work",
    description:
      "Built-in UTM tracking shows you exactly where your responses come from. Stop wasting time on channels that don't convert.",
    icon: (
      <svg className="h-5 w-5 text-[#8B5CF6] dark:text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Real-time means faster iteration",
    description:
      "Don't wait until a poll closes to act. Watch trends live, spot patterns early, and make decisions while the data is still fresh.",
    icon: (
      <svg className="h-5 w-5 text-[#F97316] dark:text-[#FB923C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Transparent results build trust",
    description:
      "Publish final results so everyone — your team, your community, your stakeholders — can see the outcome. No black-box decisions.",
    icon: (
      <svg className="h-5 w-5 text-[#EC4899] dark:text-[#F472B6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export function ValueProp() {
  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-pb-tertiary">
              WHY IT MATTERS
            </span>
            <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground font-[family-name:var(--font-heading)]">
              Stop Guessing. Start Knowing.
            </h2>
          </div>
        </Reveal>

        <StaggerParent stagger={0.1} className="space-y-4 max-w-[800px] mx-auto">
          {valuePoints.map((v) => (
            <StaggerChild key={v.title}>
              <div className="flex gap-5 rounded-[20px] border border-border bg-card p-6 md:p-8 shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                <div className="h-11 w-11 rounded-xl bg-pb-nested flex items-center justify-center flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </section>
  );
}
