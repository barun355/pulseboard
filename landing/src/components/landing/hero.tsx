import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
      {/* Gradient blobs */}
      <div
        className="pointer-events-none absolute top-[-100px] -right-50 h-[500px] w-[500px] rounded-full opacity-40 blur-[100px] animate-drift"
        style={{ background: "#FED7AA" }}
      />
      <div
        className="pointer-events-none absolute top-[100px] left-[-150px] h-[400px] w-[400px] rounded-full opacity-30 blur-[100px] animate-drift"
        style={{ background: "#A7F3D0", animationDelay: "5s" }}
      />
      <div
        className="pointer-events-none absolute top-[-50px] left-[20%] h-[350px] w-[350px] rounded-full opacity-30 blur-[120px] animate-drift"
        style={{ background: "#BFDBFE", animationDelay: "10s" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#F0FDF4] border border-[rgba(34,197,94,0.2)] px-4 py-1.5 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[13px] font-semibold text-[#16A34A] tracking-wide">
            NOW IN BETA
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-[720px] text-4xl md:text-[60px] font-bold leading-[1.08] tracking-[-0.035em] text-[#1A1A2E] font-[family-name:var(--font-heading)]">
          Create Polls. Get Real-Time Insights.{" "}
          <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
            Make Better Decisions.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-[600px] text-lg md:text-xl leading-relaxed text-[#6B7280]">
          Build beautiful polls in seconds, share them with anyone, and watch
          responses stream in live — with analytics that tell you what your
          audience actually thinks.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-xl bg-[#1A1A2E] px-7 py-3.5 text-[16px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#2D2D42] hover:-translate-y-px active:scale-[0.98]"
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
            className="inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] px-7 py-3.5 text-[16px] font-medium text-[#1A1A2E] transition-all duration-150 hover:bg-[rgba(0,0,0,0.03)]"
          >
            See How It Works
          </a>
        </div>

        {/* Trust signal */}
        <p className="mt-6 text-sm text-[#9CA3AF]">
          No credit card required. Set up in under 60 seconds.
        </p>

        {/* Product preview cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
          {/* Card 1: Poll creation */}
          <div className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#EFF6FF] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#1A1A2E]">Create</span>
            </div>
            <div className="space-y-2.5">
              <div className="h-3 w-3/4 rounded-full bg-[#F5F5F3]" />
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-xl bg-[#F5F5F3]" />
                <div className="h-8 flex-1 rounded-xl bg-[#EFF6FF] border border-[#3B82F6]/20" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-xl bg-[#F5F5F3]" />
                <div className="h-8 flex-1 rounded-xl bg-[#F5F5F3]" />
              </div>
            </div>
          </div>

          {/* Card 2: Share */}
          <div className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#F0FDF4] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#1A1A2E]">Share</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-xl bg-[#F9F9F7] px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-[#22C55E]" />
                <div className="h-2 flex-1 rounded-full bg-[#E5E7EB]" />
              </div>
              <div className="flex gap-2">
                <div className="h-7 flex-1 rounded-lg bg-[#F0FDF4]" />
                <div className="h-7 flex-1 rounded-lg bg-[#EFF6FF]" />
                <div className="h-7 flex-1 rounded-lg bg-[#FEF3C7]" />
              </div>
            </div>
          </div>

          {/* Card 3: Analyze */}
          <div className="rounded-[20px] border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-ambient text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-[#F5F3FF] flex items-center justify-center">
                <svg className="h-4 w-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#1A1A2E]">Analyze</span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/20 h-[30%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/40 h-[55%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/60 h-[80%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6] h-[100%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/70 h-[65%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/50 h-[45%]" />
              <div className="w-4 rounded-t-md bg-[#8B5CF6]/80 h-[90%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
