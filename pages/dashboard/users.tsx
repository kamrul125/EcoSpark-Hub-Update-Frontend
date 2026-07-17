import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import Pagination from "../../components/Pagination";
import API from "../../utils/api";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await API.get("/users/all-users");
        
        // ব্যাকএন্ড থেকে আসা ডাটা অবজেক্ট নাকি অ্যারে তা চেক করে সেট করা
        // আপনার ব্যাকএন্ড রেসপন্স যদি { data: [...] } হয় তবে এটি কাজ করবে
        const fetchedData = res.data?.data || res.data;
        
        if (Array.isArray(fetchedData)) {
          setUsers(fetchedData);
        } else {
          setUsers([]); 
        }
      } catch (err) {
        console.error("User management fetch error:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    
    // সেফটি চেক: নিশ্চিত করা হচ্ছে users একটি অ্যারে যাতে .filter ক্রাশ না করে
    const safeUsers = Array.isArray(users) ? users : [];

    return safeUsers.filter((user) => {
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const paginatedUsers = useMemo(
    () => filteredUsers.slice((page - 1) * pageSize, page * pageSize),
    [filteredUsers, page]
  );

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">User Management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage platform members</h1>
          <p className="mt-2 text-sm text-slate-500">Search, filter, and review users with ease.</p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">Total users</p>
              <p className="text-3xl font-black text-slate-900">
                {Array.isArray(users) ? users.length : 0}
              </p>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users by name, email, or role"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300 md:w-96"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-5 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-5 py-5">{user.email}</td>
                      <td className="px-5 py-5">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role || "Member"}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        {new Date(user.createdAt || user.created_at || Date.now()).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <Pagination
              currentPage={page}
              totalPages={Math.max(1, Math.ceil(filteredUsers.length / pageSize))}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}