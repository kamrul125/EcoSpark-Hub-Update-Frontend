import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ ডাটা চেক করার জন্য একটি ফাংশন তৈরি করলাম
  const checkAuth = () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
      setToken(storedToken);

      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserRole(user?.role || "USER");
          setUserName(user?.name || null);
        } catch (error) {
          console.error("User data parsing failed:", error);
        }
      } else {
        // যদি ইউজার ডাটা না থাকে তবে স্টেট ক্লিয়ার করে দাও
        setUserRole(null);
        setUserName(null);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();

    // ✅ লগইন করার পর যাতে নেভবার সাথে সাথে আপডেট হয় তার জন্য ইভেন্ট লিসেনার
    window.addEventListener("storage", checkAuth);
    window.addEventListener("local-storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("local-storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      // ✅ লগআউটের সময় ডাইরেক্ট রিফ্রেশ দেওয়া ভালো যাতে সব স্টেট রিসেট হয়
      window.location.href = "/auth/login";
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-xl shadow-soft dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-neutral-900 transition-transform duration-200 hover:-translate-y-0.5 dark:text-neutral-100">
          <span className="text-2xl">🌱</span>
          <span className="text-lg font-black uppercase tracking-tight">EcoSpark Hub</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center justify-between gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700 dark:text-neutral-200">
            <Link href="/" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">Home</Link>
            <Link href="/ideas" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">Ideas</Link>
            <Link href="/about" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">About</Link>
            <Link href="/contact" className="transition-colors hover:text-primary-600 dark:hover:text-primary-300">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            {token ? (
              <>
                <Link href="/ideas/create" className="rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-medium focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  Add Idea
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 hover:bg-primary-50 hover:shadow-medium focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  >
                    <span className="text-lg">👤</span>
                    {userName && <span>{userName.split(' ')[0]}</span>}
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-200 bg-white shadow-medium dark:border-neutral-700 dark:bg-neutral-900">
                      <div className="py-1">
                        <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">
                          Profile
                        </Link>
                        <Link href={userRole === "ADMIN" ? "/admin" : "/dashboard/member"} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800">
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 hover:shadow-medium focus-ring dark:border-neutral-700 dark:text-neutral-100">
                  Login
                </Link>
                <Link href="/auth/signup" className="inline-flex items-center rounded-full px-2 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-all hover:bg-black/5 hover:underline hover:underline-offset-4 focus-ring dark:text-neutral-200 dark:hover:bg-white/5">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Buttons for Mobile & Theme */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 shadow-soft transition-all hover:border-primary-400 hover:text-primary-600 hover:shadow-medium focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:text-primary-300"
          >
            {mounted && theme === 'dark' ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 shadow-soft transition-all hover:border-primary-400 hover:shadow-medium focus-ring dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            aria-label="Toggle menu"
          >
            <span className="text-lg">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white/95 px-6 py-5 shadow-large dark:border-neutral-800 dark:bg-neutral-950/95 md:hidden">
          <div className="grid gap-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700 dark:text-neutral-200">
            <Link href="/" className="block transition-colors hover:text-primary-600">Home</Link>
            <Link href="/ideas" className="block transition-colors hover:text-primary-600">Ideas</Link>
            <Link href="/about" className="block transition-colors hover:text-primary-600">About</Link>
            <Link href="/contact" className="block transition-colors hover:text-primary-600">Contact</Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {token ? (
              <>
                <Link href="/ideas/create" className="block rounded-2xl bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-medium">
                  Add Idea
                </Link>
                <Link href="/dashboard/profile" className="block rounded-2xl border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 focus-ring dark:border-neutral-700 dark:text-neutral-100">
                  Profile
                </Link>
                <Link href={userRole === "ADMIN" ? "/admin" : "/dashboard/member"} className="block rounded-2xl border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 focus-ring dark:border-neutral-700 dark:text-neutral-100">
                  {userRole === "ADMIN" ? "Admin" : "Dashboard"}
                </Link>
                <button onClick={handleLogout} className="block rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 focus-ring dark:border-neutral-700 dark:text-neutral-100 text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block rounded-2xl border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-900 transition-all hover:border-primary-400 focus-ring dark:border-neutral-700 dark:text-neutral-100">
                  Login
                </Link>
                <Link href="/auth/signup" className="block rounded-full px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-neutral-700 transition-all hover:bg-black/5 hover:underline hover:underline-offset-4 dark:text-neutral-200 dark:hover:bg-white/5">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}