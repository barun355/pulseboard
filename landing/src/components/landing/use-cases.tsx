"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { Rocket, Users, GraduationCap, Megaphone } from "lucide-react";

function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
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
      { threshold: 0.2 }
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
        transition: `all 0.7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const useCases: {
  icon: ReactNode;
  iconBg: string;
  persona: string;
  description: string;
  examplePoll: string;
}[] = [
  {
    icon: <Rocket className="h-5 w-5 text-[#3B82F6]" />,
    iconBg: "bg-[#EFF6FF]",
    persona: "Startup Founders & Product Managers",
    description:
      "Validate product ideas, prioritize features, and collect user feedback before building. Know what your users actually want — not what you think they want.",
    examplePoll: "Which feature should we build next?",
  },
  {
    icon: <Users className="h-5 w-5 text-[#22C55E]" />,
    iconBg: "bg-[#F0FDF4]",
    persona: "HR & People Operations",
    description:
      "Run employee satisfaction surveys, gather team feedback on policies, and measure engagement — with anonymous mode for honest, unfiltered responses.",
    examplePoll: "How satisfied are you with our remote work policy?",
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-[#8B5CF6]" />,
    iconBg: "bg-[#F5F3FF]",
    persona: "Educators & Trainers",
    description:
      "Create quick quizzes, gather class feedback, or let students vote on topics. See who participated and how they responded in real-time.",
    examplePoll: "Which topic should we cover in next week's session?",
  },
  {
    icon: <Megaphone className="h-5 w-5 text-[#F97316]" />,
    iconBg: "bg-[#FFF7ED]",
    persona: "Community Managers & Event Organizers",
    description:
      "Engage your community with polls, let attendees vote on session topics, or gather post-event feedback. Track which platform drives the most engagement.",
    examplePoll: "What type of content do you want to see more of?",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 md:py-28 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
            USE CASES
          </span>
          <h2 className="mt-3 text-3xl md:text-[42px] font-bold leading-[1.15] tracking-[-0.03em] text-[#1A1A2E] font-[family-name:var(--font-heading)]">
            Built for Anyone Who Needs Answers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {useCases.map((uc, i) => (
            <AnimateOnScroll key={uc.persona} delay={i * 100}>
              <div className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-[#FAFAF7] p-8 shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated h-full">
                <div
                  className={`h-11 w-11 rounded-xl ${uc.iconBg} flex items-center justify-center`}
                >
                  {uc.icon}
                </div>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-[#1A1A2E]">
                  {uc.persona}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">
                  {uc.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white border border-[rgba(0,0,0,0.06)] px-4 py-2.5">
                  <svg
                    className="h-4 w-4 text-[#9CA3AF]"
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
                  <span className="text-sm text-[#6B7280] italic">
                    &ldquo;{uc.examplePoll}&rdquo;
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
