import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface DashboardLayoutProps {
  userRole: "ADMIN" | "USER";
  children: ReactNode;
}

const adminNav = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Manage Users", href: "/dashboard/users" },
  { label: "Manage Ideas", href: "/dashboard/moderation" },
  { label: "Analytics", href: "/dashboard/admin" },
  { label: "Categories", href: "/dashboard/categories" },
];

const memberNav = [
  { label: "Overview", href: "/dashboard/member" },
  { label: "My Ideas", href: "/dashboard/member" },
  { label: "Profile / Settings", href: "/dashboard/profile" },
];

export default function DashboardLayout({ userRole, children }: DashboardLayoutProps) {
  const router = useRouter();
  const navItems = userRole === "ADMIN" ? adminNav : memberNav;

  const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || localStorage.getItem('accessToken')) : null;
  const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let userName = '';
  try {
    if (userData) userName = JSON.parse(userData).name || '';
  } catch (e) {}

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:block">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Dashboard
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">
              {userRole === "ADMIN" ? "Admin Console" : "Member Hub"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {userRole === "ADMIN"
                ? "Moderate ideas, manage users, and review performance."
                : "Manage your ideas and personalize your profile."}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          {/* Top header inside dashboard */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="hidden items-center gap-6 md:flex">
              <h3 className="text-lg font-black text-slate-900">{userRole === 'ADMIN' ? 'Admin Console' : 'Member Hub'}</h3>
              <p className="text-sm text-slate-500">Manage your workspace and track impact metrics</p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button onClick={() => window.location.href = '/'} className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Home</button>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
                  onClick={() => setProfileOpen((s) => !s)}
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden truncate sm:inline-block">{userName || 'Profile'}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="py-1">
                      <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profile</Link>
                      <Link href="/" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Home</Link>
                      <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:hidden">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">
                {userRole === "ADMIN" ? "Admin Console" : "Member Hub"}
              </h2>
            </div>
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
