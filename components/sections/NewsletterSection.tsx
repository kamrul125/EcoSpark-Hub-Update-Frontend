import { motion } from "framer-motion";

export default function NewsletterSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65 }}
      className="px-6 py-20 mx-auto max-w-7xl sm:px-10 lg:px-12"
    >
      <div className="rounded-4xl border border-slate-200 bg-linear-to-r from-emerald-50 to-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div className="grid gap-10 xl:grid-cols-[1.3fr_1fr] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Stay in the loop</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
              Weekly updates for sustainable builders.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Subscribe to receive community highlights, product launches, and best practices for creating lasting climate impact.
            </p>
          </div>

          <form className="grid gap-4 sm:grid-cols-[1.6fr_0.9fr]">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-emerald-500/20"
            />
            <button type="submit" className="rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-emerald-700">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
