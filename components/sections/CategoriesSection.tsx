const categories = [
  { title: "Clean Energy", description: "Solar, wind, and renewable products for everyday use." },
  { title: "Waste Reduction", description: "Reusable solutions for home, office, and community reuse." },
  { title: "Sustainable Mobility", description: "Low-carbon transport ideas and services." },
  { title: "Circular Economy", description: "Products built for longevity, reuse, and recovery." },
];

export default function CategoriesSection() {
  return (
    <section className="px-6 py-20 mx-auto max-w-7xl sm:px-10 lg:px-12">
      <div className="mb-12 text-center">
        <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          Explore categories
        </p>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          Ideas by impact area
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Find green ideas and eco products that match your climate goals, local community needs, and sustainable lifestyle.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div key={category.title} className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 h-12 w-12 rounded-3xl bg-emerald-50 text-emerald-600 grid place-items-center text-xl shadow-sm dark:bg-emerald-500/10 dark:text-emerald-200">
              ♻️
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50">{category.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{category.description}</p>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-emerald-700 transition-colors group-hover:text-emerald-900 dark:text-emerald-300">
              View ideas →
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
