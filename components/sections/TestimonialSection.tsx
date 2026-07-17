import { motion } from "framer-motion";

const reviews = [
  {
    name: "Amina Rahman",
    role: "Community Leader",
    quote: "EcoSpark gave our recycling project a launchpad, and members responded with volunteers, donations, and momentum.",
  },
  {
    name: "Rafiq Khan",
    role: "Product Founder",
    quote: "We refined our solar lantern using community feedback and reached buyers who care about sustainable design.",
  },
  {
    name: "Sadia Noor",
    role: "Sustainability Coach",
    quote: "This platform accelerates collaboration across nonprofits, startups, and climate advocates.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="px-6 py-20 bg-slate-50 text-slate-900 sm:px-10 lg:px-12 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-12 text-center">
        <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          Trusted by changemakers
        </p>
        <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Community stories that show real environmental progress.</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">“{review.quote}”</p>
            <div className="mt-8">
              <p className="text-lg font-black text-slate-900 dark:text-slate-50">{review.name}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">{review.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
