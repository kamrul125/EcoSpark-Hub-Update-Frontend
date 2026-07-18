import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import API from "../../utils/api";
import IdeaCard from "../../components/IdeaCard";
import SearchSuggestions from "../../components/SearchSuggestions";

const categoryTabs = ["All", "Energy", "Waste Management", "Transportation", "Sustainability"];
const statusOptions = ["All", "Draft", "Pending", "Approved", "Rejected"];

export default function ExploreIdeas() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIdeas, setTotalIdeas] = useState(0);

  const handleSuggestionSelect = (value: string) => {
    setSearchQuery(value);
    setDebouncedSearch(value);
    setCurrentPage(1);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedStatus !== "All") params.append("status", selectedStatus.toLowerCase());
      params.append("sort", sortBy);
      params.append("page", currentPage.toString());
      const limit = 12;
      params.append("limit", String(limit));

      const res = await API.get(`/ideas?${params.toString()}`);
      const data = res.data?.data || res.data?.result || res.data || [];
      const finalData = Array.isArray(data) ? data : [];

      const normalizeStatus = (idea: any) => (idea.status || idea.approvalStatus || "draft").toString().toLowerCase();
      const normalizeCategory = (idea: any) => idea.category?.name?.toString() || idea.category?.toString() || "general";
      const normalizeVotes = (idea: any) => idea._count?.votes ?? idea.voteCount ?? idea.votes?.length ?? 0;

      const filtered = finalData.filter((idea: any) => {
        const matchesSearch = debouncedSearch
          ? (idea.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) || idea.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) || normalizeCategory(idea).toLowerCase().includes(debouncedSearch.toLowerCase()))
          : true;
        const matchesCategory = selectedCategory === "All" || normalizeCategory(idea).toLowerCase() === selectedCategory.toLowerCase();
        const matchesStatus = selectedStatus === "All" || normalizeStatus(idea) === selectedStatus.toLowerCase();
        return matchesSearch && matchesCategory && matchesStatus;
      });

      const sorted = [...filtered].sort((a: any, b: any) => {
        if (sortBy === "most_voted") {
          return normalizeVotes(b) - normalizeVotes(a);
        }
        const aDate = new Date(a.createdAt || a.updatedAt || a.publishedAt || 0).getTime();
        const bDate = new Date(b.createdAt || b.updatedAt || b.publishedAt || 0).getTime();
        return bDate - aDate;
      });

      const total = sorted.length;
      const pages = Math.max(1, Math.ceil(total / limit));
      const start = (currentPage - 1) * limit;
      const paginated = sorted.slice(start, start + limit);

      setIdeas(paginated);
      setTotalPages(pages);
      setTotalIdeas(total);
    } catch (err) {
      console.error("API Error:", err);
      setIdeas([]);
      setTotalPages(1);
      setTotalIdeas(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedStatus, sortBy, currentPage]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await API.delete(`/ideas/${id}`);
        setIdeas((prev) => prev.filter((idea) => idea.id !== id));
        setTotalIdeas((prev) => prev - 1);
      } catch (err) {
        alert("Unable to delete the idea.");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="grow">
        <section className="px-6 py-12 mx-auto max-w-7xl sm:px-10 lg:px-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Explore Ideas
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-400">
              Discover innovative eco-friendly ideas and support sustainable projects.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900"
            />
            <SearchSuggestions query={searchQuery} onSelect={handleSuggestionSelect} />
          </div>

          {/* Filters and Sorting */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              {categoryTabs.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="newest">Newest</option>
                  <option value="most_voted">Most Voted</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Status:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                  setSortBy("newest");
                  setSearchQuery("");
                  setDebouncedSearch("");
                  setCurrentPage(1);
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {totalIdeas} ideas found
            </p>
          </div>

          {/* Ideas Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 shadow-sm animate-pulse"
                >
                  <div className="h-52 bg-slate-300" />
                  <div className="flex flex-1 flex-col p-6 gap-4">
                    <div className="space-y-3">
                      <div className="h-6 w-3/4 rounded-full bg-slate-300" />
                      <div className="h-4 rounded-full bg-slate-300" />
                      <div className="h-4 w-5/6 rounded-full bg-slate-300" />
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="h-4 w-1/2 rounded-full bg-slate-300" />
                      <div className="h-12 rounded-[1rem] bg-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {ideas.length > 0 ? (
                ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    currentUser={currentUser || undefined}
                    onDelete={handleDelete}
                    onEdit={(id) => router.push(`/ideas/${id}?edit=true`)}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-4xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400">
                  <p className="text-xl font-black">No ideas found.</p>
                  <p className="mt-3 text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}