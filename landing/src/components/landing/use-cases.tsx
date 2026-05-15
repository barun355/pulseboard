"use client";

import { type ReactNode } from "react";
import { Reveal, StaggerParent, StaggerChild } from "./reveal";
import { Rocket, Users, GraduationCap, Megaphone } from "lucide-react";

const useCases: {
  icon: ReactNode;
  iconBg: string;
  persona: string;
  description: string;
  examplePoll: string;
}[] = [
  {
    icon: <Rocket className="h-5 w-5 text-[#3B82F6] dark:text-[#60A5FA]" />,
    iconBg: "bg-[#EFF6FF] dark:bg-[#172242]",
    persona: "Startup Founders & Product Managers",
    description:
      "Validate product ideas, prioritize features, and collect user feedback before building. Know what your users actually want — not what you think they want.",
    examplePoll: "Which feature should we build next?",
  },
  {
    icon: <Users className="h-5 w-5 text-[#22C55E] dark:text-[#4ADE80]" />,
    iconBg: "bg-[#F0FDF4] dark:bg-[#0F2E1D]",
    persona: "HR & People Operations",
    description:
      "Run employee satisfaction surveys, gather team feedback on policies, and measure engagement — with anonymous mode for honest, unfiltered responses.",
    examplePoll: "How satisfied are you with our remote work policy?",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-[#8B5CF6] dark:text-[#A78BFA]" />,
    iconBg: "bg-[#F5F3FF] dark:bg-[#211D3A]",
    persona: "Educators & Trainers",
    description:
      "Create quick quizzes, gather class feedback, or let students vote on topics. See who participated and how they responded in real-time.",
    examplePoll: "Which topic should we cover in next week's session?",
  },
  {
    icon: <Megaphone className="h-5 w-5 text-[#F97316] dark:text-[#FB923C]" />,
    iconBg: "bg-[#FFF7ED] dark:bg-[#2C1E10]",
    persona: "Community Managers & Event Organizers",
    description:
      "Engage your community with polls, let attendees vote on session topics, or gather post-event feedback. Track which platform drives the most engagement.",
    examplePoll: "What type of content do you want to see more of?",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-28 bg-card">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-pb-tertiary">
              USE CASES
            </span>
            <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-foreground font-[family-name:var(--font-heading)]">
              Built for Anyone Who Needs Answers
            </h2>
          </div>
        </Reveal>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 gap-5" stagger={0.1}>
          {useCases.map((uc) => (
            <StaggerChild key={uc.persona}>
              <div className="rounded-[20px] border border-border bg-background p-8 shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated h-full">
                <div
                  className={`h-11 w-11 rounded-xl ${uc.iconBg} flex items-center justify-center`}
                >
                  {uc.icon}
                </div>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-foreground">
                  {uc.persona}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {uc.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5">
                  <svg
                    className="h-4 w-4 text-pb-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-muted-foreground italic">
                    &ldquo;{uc.examplePoll}&rdquo;
                  </span>
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </div>
    </section>
  );
}
