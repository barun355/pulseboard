"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedBarVertical } from "./animated-mockup";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
      {/* Gradient blobs */}
      <div
        className="pointer-events-none absolute top-[-100px] -right-50 h-[500px] w-[500px] rounded-full bg-[#FED7AA] opacity-40 dark:bg-[#7C3A0A] dark:opacity-15 blur-[100px] animate-drift"
      />
      <div
        className="pointer-events-none absolute top-[100px] left-[-150px] h-[400px] w-[400px] rounded-full bg-[#A7F3D0] opacity-30 dark:bg-[#166534] dark:opacity-12 blur-[100px] animate-drift"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="pointer-events-none absolute top-[-50px] left-[20%] h-[350px] w-[350px] rounded-full bg-[#BFDBFE] opacity-30 dark:bg-[#1E3A5F] dark:opacity-15 blur-[120px] animate-drift"
        style={{ animationDelay: "10s" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#F0FDF4] dark:bg-[#0F2E1D] border border-[rgba(34,197,94,0.2)] dark:border-[rgba(74,222,128,0.2)] px-4 py-1.5 mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[13px] font-semibold text-[#16A34A] dark:text-[#4ADE80] tracking-wide">
            NOW IN BETA
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-[720px] text-4xl md:text-[60px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground font-[family-name:var(--font-heading)]"
        >
          Create Polls. Get Real-Time Insights.{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] dark:from-[#60A5FA] dark:to-[#A78BFA] bg-clip-text text-transparent">
            Make Better Decisions.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mx-auto mt-6 max-w-[600px] text-lg md:text-xl leading-relaxed text-muted-foreground"
        >
          Build beautiful polls in seconds, share them with anyone, and watch
          responses stream in live — with analytics that tell you what your
          audience actually thinks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-xl border border-input px-7 py-3.5 text-[16px] font-medium text-foreground transition-all duration-150 hover:bg-muted"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Trust signal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-6 text-sm text-pb-tertiary"
        >
          No credit card required. Set up in under 60 seconds.
        </motion.p>

        {/* Product preview cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } } }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto"
        >
          {/* Card 1: Poll creation */}
          <motion.div variants={cardVariants} className="rounded-[20px] border border-border bg-card p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#EFF6FF] dark:bg-[#172242] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#3B82F6] dark:text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Create</span>
            </div>
            <div className="space-y-2.5">
              <div className="h-3 w-3/4 rounded-full bg-secondary" />
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-xl bg-secondary" />
                <div className="h-8 flex-1 rounded-xl bg-[#EFF6FF] dark:bg-[#172242] border border-[#3B82F6]/20 dark:border-[#60A5FA]/20" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-xl bg-secondary" />
                <div className="h-8 flex-1 rounded-xl bg-secondary" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Share */}
          <motion.div variants={cardVariants} className="rounded-[20px] border border-border bg-card p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#F0FDF4] dark:bg-[#0F2E1D] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#22C55E] dark:text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Share</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-xl bg-pb-nested px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <div className="h-2 flex-1 rounded-full bg-pb-skeleton" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 flex-1 rounded-lg bg-[#F0FDF4] dark:bg-[#0F2E1D]" />
                <div className="h-7 flex-1 rounded-lg bg-[#EFF6FF] dark:bg-[#172242]" />
                <div className="h-7 flex-1 rounded-lg bg-[#FEF3C7] dark:bg-[#2C2510]" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Analyze */}
          <motion.div variants={cardVariants} className="rounded-[20px] border border-border bg-card p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#F5F3FF] dark:bg-[#211D3A] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#8B5CF6] dark:text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">Analyze</span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              <AnimatedBarVertical height="30%" className="w-4 rounded-t-md bg-[#8B5CF6]/20 dark:bg-[#A78BFA]/20" delay={1.1} />
              <AnimatedBarVertical height="55%" className="w-4 rounded-t-md bg-[#8B5CF6]/40 dark:bg-[#A78BFA]/40" delay={1.15} />
              <AnimatedBarVertical height="80%" className="w-4 rounded-t-md bg-[#8B5CF6]/60 dark:bg-[#A78BFA]/60" delay={1.2} />
              <AnimatedBarVertical height="100%" className="w-4 rounded-t-md bg-[#8B5CF6] dark:bg-[#A78BFA]" delay={1.25} />
              <AnimatedBarVertical height="65%" className="w-4 rounded-t-md bg-[#8B5CF6]/70 dark:bg-[#A78BFA]/70" delay={1.3} />
              <AnimatedBarVertical height="45%" className="w-4 rounded-t-md bg-[#8B5CF6]/50 dark:bg-[#A78BFA]/50" delay={1.35} />
              <AnimatedBarVertical height="90%" className="w-4 rounded-t-md bg-[#8B5CF6]/80 dark:bg-[#A78BFA]/80" delay={1.4} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
