import { motion } from "framer-motion";

const faqItems = [
  {
    question: "How can I submit a new sustainability idea?",
    answer: "Create a new idea from the Ideas page, add a clear outcome, pick the right category, and publish it for the EcoSpark community to vote on.",
  },
  {
    question: "Who can join the EcoSpark community?",
    answer: "Everyone is welcome — entrepreneurs, nonprofit organizers, students, and anyone who wants to contribute to climate-friendly innovation.",
  },
  {
    question: "How are project results measured?",
    answer: "Ideas are tracked by community engagement, votes, and outcome metrics so high-impact projects rise quickly and receive more support.",
  },
  {
    question: "Can I collaborate with other members?",
    answer: "Yes — connect with contributors, share feedback, and build partnerships that help your green idea scale faster.",
  },
];

export default function FaqSection() {
  return (
    <section className="px-6 py-20 bg-slate-50 text-slate-900 sm:px-10 lg:px-12 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
            Frequently asked questions
          </p>
          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">Everything you need to know about launching and scaling green ideas.</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <motion.details
              key={item.question}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group rounded-4xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900"
            >
              <summary className="cursor-pointer text-lg font-black text-slate-900 dark:text-slate-50">
                {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
