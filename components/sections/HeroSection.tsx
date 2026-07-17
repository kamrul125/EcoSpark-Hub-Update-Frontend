import Link from "next/link";
import { motion } from "framer-motion";

const heroStats = [
  { label: "Ideas shared", value: "12.8K+" },
  { label: "Active members", value: "46K" },
  { label: "CO₂ reduced", value: "9.3M kg" },
];

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      className="relative min-h-[70vh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),transparent_25%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),transparent_30%),linear-gradient(180deg,#ecfdf5_0%,#f8fafc_35%,#ffffff_100%)] py-24 dark:bg-slate-950"
    >
      <div className="relative px-6 mx-auto max-w-7xl sm:px-10 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ x: -32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
              Powering sustainable ideas
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl xl:text-6xl dark:text-slate-50">
              Ignite green innovation with products, services, and community action that reduce waste and restore nature.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Connect with climate-conscious founders, explore circular solutions, and turn everyday sustainability into measurable impact.
            </p>

            <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:items-center">
              <Link href="/ideas" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">
                Explore Ideas
              </Link>
              <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                Join the ecosystem
              </Link>
            </div>

            <div className="grid gap-4 mt-14 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                  <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{item.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900/85">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-cyan-400" />
            <div className="p-8 sm:p-10">
              <div className="rounded-[2rem] bg-slate-50 p-6 shadow-inner shadow-slate-200/50 dark:bg-slate-950/90 dark:shadow-black/20">
                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      🌱 Verified sustainability
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Community-powered discovery</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Browse climate-safe products, circular services, and ideas that support regenerative growth.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
                      <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Featured</p>
                      <p className="mt-4 text-lg font-black text-slate-900 dark:text-slate-50">Community solar hub</p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
                      <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Impact</p>
                      <p className="mt-4 text-lg font-black text-slate-900 dark:text-slate-50">4.8K volunteer hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
