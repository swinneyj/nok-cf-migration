export default function CategoryEventsBrowserFallback() {
  return (
    <section className="px-4 py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="section-eyebrow mb-3">View Events</div>
            <div className="h-10 w-72 rounded-xl bg-white/10" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/5" />
            <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-white/5" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-4">
            <div className="mb-2 h-4 w-24 rounded bg-gold-500/20" />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="h-12 w-full rounded-xl bg-night-800 sm:w-[220px]" />
              <div className="h-12 w-full rounded-xl bg-gold-500/80 sm:w-[160px]" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="flex min-h-[240px] items-center justify-center text-white/70">
            Loading events...
          </div>
        </div>
      </div>
    </section>
  );
}
