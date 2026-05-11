import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-white">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, #BFDBFE 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #A7F3D0 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-8 text-center">
        <h2 className="text-3xl md:text-[48px] font-bold leading-[1.1] tracking-[-0.03em] text-[#1A1A2E] font-[family-name:var(--font-heading)]">
          Ready to Hear What Your
          <br />
          Audience Thinks?
        </h2>
        <p className="mt-5 text-lg text-[#6B7280] max-w-[500px] mx-auto">
          Create your first poll in under 60 seconds. Free. No credit card.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-xl bg-[#1A1A2E] px-8 py-4 text-[16px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#2D2D42] hover:-translate-y-px active:scale-[0.98]"
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
          <a
            href="#"
            className="text-[15px] font-medium text-[#6B7280] transition-colors hover:text-[#1A1A2E]"
          >
            Or explore a sample poll
          </a>
        </div>
      </div>
    </section>
  );
}
