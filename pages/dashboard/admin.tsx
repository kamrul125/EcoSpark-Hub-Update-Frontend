import { useEffect, useMemo, useState } from "react";
// @ts-ignore
// @ts-ignore
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import Pagination from "../../components/Pagination";
import API from "../../utils/api";

const COLORS = ["#10b981", "#6366f1", "#f97316", "#ec4899", "#38bdf8"];

function formatMonth(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short" });
}

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ideasRes, usersRes] = await Promise.all([
        API.get("/ideas"),
        API.get("/users/all-users"),
      ]);

      setIdeas(ideasRes.data?.data || ideasRes.data || []);
      setUsers(usersRes.data?.data || usersRes.data || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredIdeas = useMemo(() => {
    const term = search.toLowerCase();
    return ideas.filter((idea) => {
      return (
        idea.title?.toLowerCase().includes(term) ||
        idea.category?.name?.toLowerCase().includes(term) ||
        idea.author?.name?.toLowerCase().includes(term)
      );
    });
  }, [ideas, search]);

  const paginatedIdeas = useMemo(
    () => filteredIdeas.slice((page - 1) * pageSize, page * pageSize),
    [filteredIdeas, page]
  );

  const bookingTrendData = useMemo(() => {
    const monthCounts = new Map<string, number>();
    ideas.forEach((idea) => {
      if (!idea.createdAt) return;
      const month = formatMonth(idea.createdAt);
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthOrder
      .filter((month) => monthCounts.has(month))
      .map((month) => ({ month, ideas: monthCounts.get(month) ?? 0 }));
  }, [ideas]);

  const votesTrendData = useMemo(() => {
    const monthVotes = new Map<string, number>();
    ideas.forEach((idea) => {
      if (!idea.createdAt) return;
      const month = formatMonth(idea.createdAt);
      const votes = idea._count?.votes || idea.votes?.length || 0;
      monthVotes.set(month, (monthVotes.get(month) || 0) + votes);
    });
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthOrder
      .filter((m) => monthVotes.has(m))
      .map((m) => ({ month: m, votes: monthVotes.get(m) ?? 0 }));
  }, [ideas]);

  const estimatedCarbonKg = useMemo(() => {
    // Simple heuristic: each vote ~ 0.2 kg CO2 offset (example assumption)
    const totalVotes = ideas.reduce((sum, i) => sum + (i._count?.votes || i.votes?.length || 0), 0);
    return Math.round(totalVotes * 0.2);
  }, [ideas]);

  const categoryData = useMemo(() => {
    const categories = new Map<string, number>();
    ideas.forEach((idea) => {
      const name = idea.category?.name || "General";
      categories.set(name, (categories.get(name) || 0) + 1);
    });
    return Array.from(categories.entries()).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        const res = await API.delete(`/ideas/${id}`);
        if (res.data.success) {
          alert("Deleted Successfully! 🎉");
          fetchData();
        }
      } catch (err: any) {
        alert("Delete failed!");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="p-20 text-center text-slate-500">Loading admin dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Admin Overview</p>
              <h1 className="mt-3 text-3xl font-black text-slate-900">Idea trends & platform health</h1>
              <p className="mt-2 text-sm text-slate-500">Insightful charts and tables for admin decision making.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total Ideas</p>
                <p className="mt-4 text-3xl font-black text-slate-900">{ideas.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Total Users</p>
                <p className="mt-4 text-3xl font-black text-slate-900">{users.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Categories</p>
                <p className="mt-4 text-3xl font-black text-slate-900">{categoryData.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Idea trends</h2>
                <p className="text-sm text-slate-500">Monthly idea submissions.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{ideas.length} items</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="ideas" fill="#10b981" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Category breakdown</h2>
              <p className="text-sm text-slate-500">Distribution of ideas by category.</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#10b981"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Votes over time</h2>
                <p className="text-sm text-slate-500">Total votes received per month.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{ideas.length} ideas</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={votesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="votes" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Estimated Carbon Offset</h2>
              <p className="text-sm text-slate-500">Approximate kg CO₂ offset from community activity.</p>
            </div>
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-5xl font-black text-emerald-600">{estimatedCarbonKg.toLocaleString()} kg</p>
                <p className="mt-2 text-sm text-slate-500">Estimated total offset based on votes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Latest Ideas</h2>
              <p className="text-sm text-slate-500">Review and monitor recently submitted ideas.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title, category, or author"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300 sm:w-80"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Idea</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Author</th>
                  <th className="px-5 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedIdeas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-slate-50">
                    <td className="px-5 py-5 font-semibold text-slate-900">{idea.title}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                        {idea.category?.name || "General"}
                      </span>
                    </td>
                    <td className="px-5 py-5">{idea.author?.name || "Unknown"}</td>
                    <td className="px-5 py-5">{new Date(idea.createdAt || idea.updatedAt || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
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
