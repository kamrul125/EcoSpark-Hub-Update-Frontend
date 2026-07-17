import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-24 dark:bg-slate-950">
      <main className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50">Contact EcoSpark</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Have a question, partnership inquiry, or feedback? We’d love to hear from you. Use the form below or reach out via email.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">Contact details</h2>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Email: <a href="mailto:support@ecospark.com" className="text-emerald-600">support@ecospark.com</a></p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Phone: +880 1234-567890</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Location: Rangpur, Bangladesh (serving globally)</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-50">Send a message</h2>
            <form className="mt-4 grid gap-3">
              <input placeholder="Your name" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <input placeholder="Your email" className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <textarea placeholder="Message" rows={5} className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              <div className="flex items-center justify-between">
                <button className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white">Send message</button>
                <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300">Back to Home</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
