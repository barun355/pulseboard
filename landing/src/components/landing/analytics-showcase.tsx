"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

function AnimateOnScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export function AnalyticsShowcase() {
  return (
    <section className="py-24 md:py-28 bg-[#FAFAF7]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            ANALYTICS
          </span>
          <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-[#1A1A2E] font-[family-name:var(--font-heading)]">
            More Than Just Counts —{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
              Real Audience Intelligence
            </span>
          </h2>
          <p className="mt-4 text-lg text-[#6B7280] max-w-[600px] mx-auto">
            Every response automatically captures device, location, source, and
            engagement metadata. Zero extra questions for respondents. Maximum
            insights for you.
          </p>
        </div>

        <AnimateOnScroll>
          <div className="rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white shadow-mockup overflow-hidden">
            {/* Dashboard header bar */}
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="text-sm font-medium text-[#6B7280]">
                PulseBoard Analytics
              </div>
              <div className="w-16" />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Row 1: Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Responses",
                    value: "1,247",
                    change: "+12%",
                    color: "#3B82F6",
                  },
                  {
                    label: "Completion Rate",
                    value: "89.3%",
                    change: "+3%",
                    color: "#22C55E",
                  },
                  {
                    label: "Avg. Time Spent",
                    value: "42s",
                    change: "-5s",
                    color: "#8B5CF6",
                  },
                  {
                    label: "Avg. Rating",
                    value: "4.2/5",
                    change: "+0.3",
                    color: "#F97316",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-4 md:p-5"
                  >
                    <div className="text-xs text-[#9CA3AF] mb-1">{stat.label}</div>
                    <div
                      className="text-2xl md:text-3xl font-bold tracking-tight"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-[#22C55E] mt-1">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: Question breakdown + Device pie */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Question breakdown - spans 3 */}
                <div className="md:col-span-3 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-5">
                  <div className="text-sm font-semibold text-[#1A1A2E] mb-4">
                    Question 1: Which feature should we build next?
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Dark mode", pct: 42, votes: 524, color: "#3B82F6" },
                      { label: "API access", pct: 28, votes: 349, color: "#8B5CF6" },
                      { label: "Mobile app", pct: 20, votes: 249, color: "#22C55E" },
                      { label: "Integrations", pct: 10, votes: 125, color: "#F97316" },
                    ].map((opt) => (
                      <div key={opt.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#1A1A2E] font-medium">
                            {opt.label}
                          </span>
                          <span className="text-xs text-[#6B7280]">
                            {opt.votes} votes ({opt.pct}%)
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${opt.pct}%`, background: opt.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[11px] text-[#9CA3AF]">Skip rate:</span>
                    <span className="text-[11px] font-medium text-[#6B7280]">3.2%</span>
                  </div>
                </div>

                {/* Device + Source - spans 2 */}
                <div className="md:col-span-2 space-y-4">
                  {/* Device breakdown */}
                  <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-5">
                    <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
                      Device Type
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Simple donut visualization */}
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="60 40" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-60" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-85" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm bg-[#3B82F6]" />
                          <span className="text-[#6B7280]">Mobile 60%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm bg-[#8B5CF6]" />
                          <span className="text-[#6B7280]">Desktop 25%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm bg-[#22C55E]" />
                          <span className="text-[#6B7280]">Tablet 15%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source breakdown */}
                  <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-5">
                    <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
                      Response Sources
                    </div>
                    <div className="space-y-2">
                      {[
                        { source: "Twitter", pct: 45, color: "#1DA1F2" },
                        { source: "WhatsApp", pct: 30, color: "#25D366" },
                        { source: "Email", pct: 20, color: "#F97316" },
                        { source: "LinkedIn", pct: 5, color: "#0A66C2" },
                      ].map((s) => (
                        <div key={s.source} className="flex items-center gap-2">
                          <span className="text-[11px] text-[#6B7280] w-16 truncate">
                            {s.source}
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${s.pct}%`, background: s.color }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-[#1A1A2E] w-7 text-right">
                            {s.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Response timeline + Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Response timeline */}
                <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-[#1A1A2E]">
                      Response Trend
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                      <span className="text-[11px] text-[#22C55E] font-medium">Live</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-24">
                    {[20, 35, 25, 45, 60, 50, 75, 65, 80, 90, 70, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-[#3B82F6] to-[#3B82F6]/50"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[#9CA3AF]">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#F9F9F7] p-5">
                  <div className="text-sm font-semibold text-[#1A1A2E] mb-3">
                    Recent Feedback
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { text: "Great poll! Very clear questions.", rating: 5 },
                      { text: "Would love more options for Q2.", rating: 4 },
                      { text: "Quick and easy to fill out.", rating: 5 },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white border border-[rgba(0,0,0,0.06)] px-3 py-2.5"
                      >
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <svg
                              key={j}
                              className={`h-3 w-3 ${
                                j < f.rating ? "text-[#FBBF24]" : "text-[#E5E7EB]"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{f.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Callout annotations */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Zero Extra Questions",
              desc: "Device, browser, OS, and locale are captured automatically from every response.",
            },
            {
              title: "Built-in UTM Attribution",
              desc: "Know exactly which channel drives responses. No Google Analytics needed.",
            },
            {
              title: "Real-Time via WebSocket",
              desc: "Watch your dashboard update live as responses stream in. No refresh needed.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-ambient"
            >
              <h4 className="text-[16px] font-semibold text-[#1A1A2E]">{c.title}</h4>
              <p className="mt-1.5 text-sm text-[#6B7280] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
