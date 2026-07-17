import { motion } from "framer-motion";

const steps = [
  {
    title: "Share your idea",
    description: "Publish a practical sustainability solution and outline its community benefits in minutes.",
    icon: "📝",
  },
  {
    title: "Build support",
    description: "Gather votes, feedback, and resources from climate-conscious collaborators.",
    icon: "🤝",
  },
  {
    title: "Track impact",
    description: "Measure real reductions in waste, energy, and emissions as your idea advances.",
    icon: "📊",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="px-6 py-20 mx-auto max-w-7xl sm:px-10 lg:px-12">
      <div className="mb-12 text-center">
        <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
          How it works
        </p>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Turn ideas into measurable sustainability outcomes.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="group rounded-4xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-2xl text-emerald-600">
              {step.icon}
            </div>
            <h3 className="mt-6 text-xl font-black text-slate-900">{step.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
