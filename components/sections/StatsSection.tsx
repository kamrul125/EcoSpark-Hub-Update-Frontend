import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Ideas shared", value: 12800, suffix: "+" },
  { label: "Community members", value: 46000, suffix: "+" },
  { label: "Carbon reduced", value: 9300000, suffix: " kg" },
  { label: "Positive feedback", value: 98, suffix: "%" },
];

export default function StatsSection() {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setCounts((current) => {
        const next = current.map((count, index) => {
          const target = stats[index].value;
          if (count >= target) return target;
          const increment = Math.max(1, Math.ceil(target / 40));
          return Math.min(count + increment, target);
        });

        if (next.every((value, index) => value >= stats[index].value)) {
          clearInterval(interval);
        }

        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [animated]);

  return (
    <section className="px-6 py-20 bg-slate-900 text-white sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">Measured impact</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">The momentum behind every green idea.</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">Track the community-driven growth, participation, and carbon savings that power EcoSpark.</p>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          onViewportEnter={() => setAnimated(true)}
        >
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10 backdrop-blur-sm"
            >
              <p className="text-4xl font-black text-white">
                {counts[index].toLocaleString()}
                {item.suffix}
              </p>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
