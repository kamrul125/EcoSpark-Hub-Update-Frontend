export default function BlogPreviewSection() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Sustainable Energy",
      excerpt: "Exploring innovative solutions for renewable energy sources and their impact on communities.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7",
      date: "2024-05-01",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Community-Driven Eco Initiatives",
      excerpt: "How grassroots movements are driving change in local sustainability efforts.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      date: "2024-04-28",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Waste Reduction Strategies",
      excerpt: "Practical tips and strategies for reducing waste in everyday life and business.",
      image: "https://images.unsplash.com/photo-1532996122724-e3bc053fa4fa",
      date: "2024-04-25",
      readTime: "6 min read",
    },
  ];

  return (
    <section className="px-6 py-20 mx-auto max-w-7xl sm:px-10 lg:px-12">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-300">
          Insights & Stories
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Latest from our blog
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-slate-600 dark:text-slate-400">
          Stay informed with the latest trends, tips, and stories from the world of sustainability.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="group rounded-4xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div className="aspect-[4/3] overflow-hidden rounded-t-4xl">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-3 text-xl font-black text-slate-900 dark:text-slate-50">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {post.excerpt}
              </p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                Read more
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          View all posts
        </button>
      </div>
    </section>
  );
}