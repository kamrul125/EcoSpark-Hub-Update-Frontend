export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">About EcoSpark Hub</p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Building a sustainable future together</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            EcoSpark Hub is a community-driven platform where people share ideas, collaborate on eco projects, and discover smarter sustainability solutions. Our mission is to make environmental innovation accessible, engaging, and actionable for every neighborhood.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Mission', description: 'Empower communities with actionable green ideas.', accent: 'emerald' },
              { title: 'Vision', description: 'A cleaner, more connected world driven by collaboration.', accent: 'sky' },
              { title: 'Values', description: 'Creativity, inclusion, and long-term sustainability.', accent: 'amber' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
