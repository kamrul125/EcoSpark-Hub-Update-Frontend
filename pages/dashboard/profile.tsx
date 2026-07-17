import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "../../utils/api";
import DashboardLayout from "../../components/DashboardLayout";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState("USER");
  const [formData, setFormData] = useState({ name: "", email: "", bio: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserRole(parsedUser.role || "USER");
          setFormData({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            bio: parsedUser.bio || "",
          });
          setUser(parsedUser);
        } catch (e) {
          console.error(e);
        }
      }
    }
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      const res = await API.patch(`/users/${user?.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update localStorage with new user data
      const updatedUser = res.data?.data || { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole={userRole as "ADMIN" | "USER"}>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-[2rem] dark:bg-slate-800" />
          <div className="h-64 bg-slate-200 rounded-[2rem] dark:bg-slate-800" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={userRole as "ADMIN" | "USER"}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Profile</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-8 p-8 lg:grid-cols-3">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center lg:col-span-1">
              <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-6xl font-black text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
                {user?.role}
              </span>
              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Joined {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </div>

            {/* Edit Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder="Tell us about yourself and your sustainability interests..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      bio: user?.bio || "",
                    });
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Ideas Created", value: "—", icon: "💡" },
            { label: "Total Votes", value: "—", icon: "👍" },
            { label: "Comments", value: "—", icon: "💬" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950">
          <h3 className="text-lg font-black text-red-700 dark:text-red-200">Danger Zone</h3>
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <div className="mt-4">
            <button className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
