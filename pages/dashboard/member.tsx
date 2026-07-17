import { useEffect, useState } from "react";
import Link from "next/link";
import API from "../../utils/api";
import DashboardLayout from "../../components/DashboardLayout";

type Idea = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  voteCount?: number;
  isExpanded?: boolean;
}

export default function MemberDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      const res = await API.get("/ideas/my-ideas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const finalData = res.data?.data || [];
      
      const processedData = (Array.isArray(finalData) ? finalData : []).map((item: Idea) => ({
        ...item,
        isExpanded: false
      }));

      setIdeas(processedData);
    } catch (err: any) {
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message || "Failed to load your ideas.";
      // If the API returns 404 (no resource) treat as empty list instead of error
      if (status === 404) {
        console.warn('Ideas endpoint returned 404 — falling back to empty list');
        setIdeas([]);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIdeas(); }, []);

  const toggleExpand = (id: string) => {
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isExpanded: !i.isExpanded } : i))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      await API.delete(`/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      alert("✅ Idea Deleted Successfully!");
    } catch (err: any) {
      alert("Failed to delete.");
    }
  };

  return (
    <DashboardLayout userRole="USER">
      <div className="space-y-8">
        <main className="w-full max-w-6xl px-6 py-10 mx-auto grow">
        <div className="flex items-center justify-between mb-8">
          
          {/* ✅ ১. ক্রিয়েট আইডিয়া লিঙ্ক আপডেট করা হয়েছে */}
          <Link href="/ideas/create" className="px-6 py-3 font-bold text-white transition-all bg-green-600 shadow-lg rounded-2xl hover:bg-green-700">
            + New Idea
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400 animate-pulse">Loading your ideas...</div>
        ) : error ? (
          <div className="py-20 text-center text-rose-500 font-bold">{error}</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ideas.length > 0 ? ideas.map((idea) => (
              <div key={idea.id} className="flex flex-col justify-between p-5 bg-white border border-gray-100 shadow-xl rounded-4xl">
                <div>
                  <img 
                    src={idea.image || "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d"} 
                    className="object-cover w-full h-48 rounded-2xl" 
                    alt={idea.title} 
                  />
                  <h2 className="mt-5 text-xl font-black text-gray-900">{idea.title}</h2>
                  <div className="mt-2">
                    <p className={`text-sm text-gray-500 leading-relaxed ${!idea.isExpanded ? "line-clamp-3" : ""}`}>
                      {idea.description || "No description provided."}
                    </p>
                    {idea.description && idea.description.length > 80 && (
                      <button 
                        onClick={() => toggleExpand(idea.id)}
                        className="text-[11px] font-black text-indigo-600 mt-2 uppercase hover:underline cursor-pointer"
                      >
                        {idea.isExpanded ? "Show Less ▲" : "See More ▼"}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  {/* ✅ ২. এডিট লিঙ্ক আপডেট করা হয়েছে (কোয়েরি প্যারামিটারসহ) */}
                  <Link
                    href={`/ideas/${idea.id}?edit=true`}
                    className="flex-1 text-center py-3 text-[10px] font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest"
                  >
                    EDIT IDEA
                  </Link>
                  <button 
                    onClick={() => handleDelete(idea.id)} 
                    className="flex-1 py-3 text-[10px] font-black text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all uppercase tracking-widest"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center text-gray-400 font-medium">
                You haven't shared any ideas yet. Start by creating one! 🚀
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </DashboardLayout>
  );
}