export default function ImpactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Impact</p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white">See how EcoSpark ideas are making a difference</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Explore the outcomes of sustainable projects, community-driven initiatives, and measurable climate action. Discover how shared ideas can transform neighborhoods and support a healthier planet.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { metric: 'Projects launched', value: '128+' },
              { metric: 'Communities engaged', value: '36' },
              { metric: 'Tons of waste reduced', value: '1.8K' },
            ].map((item) => (
              <div key={item.metric} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                <p className="text-5xl font-black text-slate-900 dark:text-white">{item.value}</p>
                <p className="mt-4 text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{item.metric}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
