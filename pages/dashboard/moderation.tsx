import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/DashboardLayout";
import Pagination from "../../components/Pagination";
import API from "../../utils/api";

const statusOptions = ["All", "Draft", "Pending", "Approved", "Rejected"];

export default function IdeaModeration() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await API.get("/ideas");
        setIdeas(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Moderation fetch error:", err);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const filteredIdeas = useMemo(() => {
    const term = search.toLowerCase();
    return ideas
      .filter((idea) => {
        if (statusFilter === "All") return true;
        return (idea.status || idea.approvalStatus || "Draft").toString().toLowerCase() === statusFilter.toLowerCase();
      })
      .filter((idea) => {
        return (
          idea.title?.toLowerCase().includes(term) ||
          idea.category?.name?.toLowerCase().includes(term) ||
          idea.author?.name?.toLowerCase().includes(term)
        );
      });
  }, [ideas, search, statusFilter]);

  const paginatedIdeas = useMemo(
    () => filteredIdeas.slice((page - 1) * pageSize, page * pageSize),
    [filteredIdeas, page]
  );

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Idea Moderation</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Review submitted ideas</h1>
          <p className="mt-2 text-sm text-slate-500">Filter ideas by status and moderate submissions quickly.</p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                    statusFilter === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search ideas..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300 md:w-80"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Idea</th>
                  <th className="px-5 py-4">Author</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedIdeas.length > 0 ? (
                  paginatedIdeas.map((idea) => (
                    <tr key={idea.id} className="hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-900">{idea.title}</td>
                      <td className="px-5 py-5">{idea.author?.name || "Unknown"}</td>
                      <td className="px-5 py-5">{idea.category?.name || "General"}</td>
                      <td className="px-5 py-5 uppercase text-slate-600">{(idea.status || idea.approvalStatus || "Draft").toString()}</td>
                      <td className="px-5 py-5">
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="inline-flex rounded-3xl bg-slate-900 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                      No ideas matched your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(filteredIdeas.length / pageSize))}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
