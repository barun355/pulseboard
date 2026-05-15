"use client";

import {
  Zap,
  Link2,
  BarChart3,
  ShieldCheck,
  Globe,
  Clock,
} from "lucide-react";
import { type ReactNode } from "react";
import { Reveal, StaggerParent, StaggerChild } from "./reveal";

const features: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
}[] = [
  {
    icon: <Zap className="h-5 w-5 text-[#F97316] dark:text-[#FB923C]" />,
    iconBg: "bg-[#FFF7ED] dark:bg-[#2C1E10]",
    title: "Create Polls in Seconds",
    description:
      "Add questions, set options, mark mandatory or optional — your poll is ready to share in under a minute. No learning curve.",
  },
  {
    icon: <Link2 className="h-5 w-5 text-[#22C55E] dark:text-[#4ADE80]" />,
    iconBg: "bg-[#F0FDF4] dark:bg-[#0F2E1D]",
    title: "Share Anywhere with One Link",
    description:
      "Generate a unique public link for each poll. Share via email, Slack, WhatsApp, or social media. UTM tracking built-in so you know which channel drives the most responses.",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-[#3B82F6] dark:text-[#60A5FA]" />,
    iconBg: "bg-[#EFF6FF] dark:bg-[#172242]",
    title: "Real-Time Live Analytics",
    description:
      "Watch responses stream in live via WebSocket. See option counts, participation rates, and trends update the instant someone submits.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-[#8B5CF6] dark:text-[#A78BFA]" />,
    iconBg: "bg-[#F5F3FF] dark:bg-[#211D3A]",
    title: "Anonymous or Authenticated",
    description:
      "Let respondents answer anonymously for honest feedback, or require authentication to track who said what. You choose per poll.",
  },
  {
    icon: <Globe className="h-5 w-5 text-[#EC4899] dark:text-[#F472B6]" />,
    iconBg: "bg-[#FDF2F8] dark:bg-[#2C1222]",
    title: "Smart Audience Insights",
    description:
      "Automatically capture device type, browser, location, and traffic source — without asking respondents a single extra question.",
  },
  {
    icon: <Clock className="h-5 w-5 text-[#F97316] dark:text-[#FB923C]" />,
    iconBg: "bg-[#FFF7ED] dark:bg-[#2C1E10]",
    title: "Auto-Expiry & Result Publishing",
    description:
      "Set an expiry time and your poll automatically closes. Publish results so anyone with the link can view the final outcome.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-28 bg-background">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-pb-tertiary">
              FEATURES
            </span>
            <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground font-[family-name:var(--font-heading)]">
              Why PulseBoard
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-[500px] mx-auto">
              Everything you need to create polls, collect responses, and
              understand your audience.
            </p>
          </div>
        </Reveal>

        {/* Feature cards */}
        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1}>
          {features.map((f) => (
            <StaggerChild key={f.title}>
              <div className="rounded-[20px] border border-border bg-card p-8 shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated h-full">
                <div
                  className={`h-11 w-11 rounded-xl ${f.iconBg} flex items-center justify-center`}
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </section>
  );
}
