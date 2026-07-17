import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import API from '../../utils/api';

interface IdeaCardData {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  category?: { name?: string } | string | null;
  _count?: { votes?: number };
}

function IdeaCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="mb-6 h-56 rounded-3xl bg-slate-200" />
      <div className="flex flex-1 flex-col justify-between gap-5">
        <div className="space-y-4">
          <div className="h-5 w-2/3 rounded-full bg-slate-200" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200" />
            <div className="h-4 w-4/6 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="h-12 w-32 rounded-full bg-slate-200" />
      </div>
    </article>
  );
}

export default function FeaturedIdeasSection() {
  const [ideas, setIdeas] = useState<IdeaCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchIdeas = async () => {
      try {
        const response = await API.get('/ideas?limit=8');
        if (mounted) {
          setIdeas(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to load ideas', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchIdeas();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="px-6 py-20 mx-auto max-w-7xl sm:px-10 lg:px-12">
      <div className="mb-12 text-center">
        <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
          Featured ideas
        </p>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Innovative sustainability concepts ready for action.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Explore real projects shaping cleaner streets, smarter buildings, and stronger climate resilience.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <IdeaCardSkeleton key={index} />)
          : ideas.map((idea, index) => {
              const imageUrl =
                typeof idea.image === 'string' && idea.image
                  ? idea.image
                  : 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80';

              const categoryLabel =
                typeof idea.category === 'string'
                  ? idea.category
                  : idea.category?.name || 'Innovation';

              return (
                <motion.article
                  key={idea.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group flex h-full flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={idea.title}
                      onError={(event) => {
                        const img = event.currentTarget as HTMLImageElement;
                        img.onerror = null;
                        img.src =
                          'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80';
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 inline-flex rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-700/20">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-7 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 line-clamp-2">{idea.title}</h3>
                      <p className="text-sm leading-7 text-slate-600 line-clamp-3">{idea.description}</p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <span>{categoryLabel}</span>
                        <span>{idea._count?.votes ?? 0} votes</span>
                      </div>
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-emerald-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
      </div>
    </section>
  );
}
