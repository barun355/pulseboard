export function SocialProof() {
  return (
    <section className="border-y border-[rgba(0,0,0,0.06)] bg-white py-6">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
        <div className="flex items-center gap-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {[
              "bg-[#3B82F6]",
              "bg-[#22C55E]",
              "bg-[#F97316]",
              "bg-[#8B5CF6]",
            ].map((bg, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
              >
                {["S", "A", "M", "R"][i]}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-[#6B7280]">
            Join <span className="font-semibold text-[#1A1A2E]">500+</span> poll creators
          </span>
        </div>

        <div className="hidden sm:block h-5 w-px bg-[rgba(0,0,0,0.1)]" />

        <span className="text-sm text-[#9CA3AF]">
          Built for startups, educators, and teams of all sizes
        </span>
      </div>
    </section>
  );
}
