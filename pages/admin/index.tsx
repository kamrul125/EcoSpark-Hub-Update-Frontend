import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import API from "../../utils/api";

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ideas"); 
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // আইডিয়া এবং ইউজার ডাটা ফেচ করা
        const [ideasRes, usersRes] = await Promise.all([
          API.get("/ideas"),
          API.get("/users/all-users") 
        ]);
        
        // এপিআই রেসপন্স হ্যান্ডেল করা
        setIdeas(ideasRes.data?.data || ideasRes.data?.result || ideasRes.data || []);
        setUsers(usersRes.data?.data || usersRes.data?.result || usersRes.data || []);
        
      } catch (err) {
        console.error("Admin Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalVotes = ideas.reduce((sum, idea) => sum + (idea.voteCount || 0), 0);

  const handleDeleteIdea = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত এই আইডিয়াটি ডিলিট করতে চান?")) {
      try {
        await API.delete(`/ideas/${id}`);
        setIdeas(prev => prev.filter(i => i.id !== id));
        alert("সফলভাবে ডিলিট হয়েছে! ✅");
      } catch (err) { 
        alert("ডিলিট করতে সমস্যা হয়েছে।"); 
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-t-green-600 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <main className="w-full max-w-7xl px-6 py-12 mx-auto grow">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Admin Central</h1>
          <p className="text-green-600 font-bold text-xs mt-2 tracking-widest uppercase">System Overview & Controls</p>
        </div>

        {/* 📊 স্ট্যাটাস কার্ডস - rounded-4xl ব্যবহার করা হয়েছে */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start transition-transform hover:scale-105">
            <span className="text-2xl mb-2">👥</span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
            <h2 className="text-4xl font-black text-emerald-600">{users.length}</h2>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start transition-transform hover:scale-105">
            <span className="text-2xl mb-2">💡</span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Ideas</p>
            <h2 className="text-4xl font-black text-indigo-600">{ideas.length}</h2>
          </div>

          <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100 flex flex-col items-center md:items-start transition-transform hover:scale-105">
            <span className="text-2xl mb-2">🔥</span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Votes</p>
            <h2 className="text-4xl font-black text-orange-500">{totalVotes}</h2>
          </div>
        </div>

        {/* 📑 ট্যাব কন্ট্রোল */}
        <div className="flex justify-center md:justify-start gap-4 mb-8">
          <button 
            onClick={() => setActiveTab("ideas")}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'ideas' ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'}`}
          >
            Manage Ideas
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'}`}
          >
            Manage Users
          </button>
        </div>

        {/* 📋 ডাটা টেবিল সেকশন - rounded-4xl ব্যবহার করা হয়েছে */}
        <div className="bg-white rounded-4xl shadow-xl border border-gray-100 overflow-hidden">
          {activeTab === "ideas" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Idea</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Author</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ideas.map((idea) => (
                    <tr key={idea.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="p-6 font-bold text-gray-800">{idea.title}</td>
                      <td className="p-6 text-sm text-gray-500 font-medium">{idea.author?.name || "Member"}</td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase border border-indigo-100">
                          {idea.category?.name || "Global"}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-4">
                        <button onClick={() => router.push(`/ideas/${idea.id}`)} className="text-[10px] font-black text-indigo-500 uppercase hover:underline">View</button>
                        <button onClick={() => handleDeleteIdea(idea.id)} className="text-[10px] font-black text-rose-500 uppercase hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">User</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Role</th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="p-6 font-bold text-gray-800">{u.name || "N/A"}</td>
                        <td className="p-6 text-sm text-gray-500">{u.email}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase border ${
                            u.role === 'ADMIN' 
                              ? 'bg-rose-50 text-rose-600 border-rose-100' 
                              : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase border ${
                            u.status === 'BLOCKED' 
                              ? 'bg-red-50 text-red-600 border-red-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {u.status === 'ACTIVATE' ? 'Active' : u.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}