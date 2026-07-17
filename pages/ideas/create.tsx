import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useRouter } from "next/router";

export default function CreateIdea() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // ডিফল্ট ৪টি ক্যাটাগরি যা আমরা সবসময় দেখাতে চাই
  const staticCategories = [
    // deterministic UUIDs that match backend seeds (see backend seed.ts)
    { id: '6b1f9c0a-4c2b-4f3d-9b2a-1a2b3c4d5e6f', name: 'Energy' },
    { id: 'a3f9d2b0-6c7e-4a1b-8d3c-2b4a5f6e7d8c', name: 'Waste Management' },
    { id: 'd2c3b4a5-6e7f-4c8b-9a1b-3c4d5e6f7a8b', name: 'Transportation' },
    { id: 'f1e2d3c4-b5a6-4f7e-8d9c-0a1b2c3d4e5f', name: 'Sustainability' }
  ];

  const getAuthHeader = () => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);
        const res = await API.get("/categories", getAuthHeader());
        console.log("GET /categories response:", res.data);
        const categoryList = res.data?.data || res.data?.categories || res.data || [];

        // Prefer DB categories (with real IDs). Append any static fallbacks that
        // don't exist in the DB (so users still see common categories).
        if (Array.isArray(categoryList) && categoryList.length > 0) {
          const normalizedDb = categoryList.map((c: any) => ({ id: c.id, name: c.name }));
          const missingStatics = staticCategories.filter((s) =>
            !normalizedDb.some((d: any) => d.name.toLowerCase() === s.name.toLowerCase())
          );
          setCategories([...normalizedDb, ...missingStatics]);
        } else {
          // No categories returned from backend. Keep static fallbacks but
          // don't allow sending raw names as IDs — handle in submit.
          setCategories(staticCategories);
        }
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
        setCategories(staticCategories);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category!");
      return;
    }

    setLoading(true);
    try {
      // Ensure we send a UUID categoryId. If the selected value is a name, try resolving it.
      const isUUID = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

      let categoryId = category;
      if (!isUUID(categoryId)) {
        // try to resolve from already-fetched categories
        const found = categories.find((c) => (c.id && c.id === categoryId) || c.name.toLowerCase() === String(categoryId).toLowerCase());
        if (found && found.id) {
          categoryId = found.id;
        } else {
          // fetch from backend as a last attempt
          try {
            const res = await API.get('/categories');
            const dbCats = res.data?.data || res.data || [];
            const match = dbCats.find((c: any) => c.name.toLowerCase() === String(categoryId).toLowerCase());
            if (match) categoryId = match.id;
          } catch (err) {
            // leave categoryId as-is (non-UUID) so validation will fail on server and we can show helpful message
            console.warn('Could not resolve category name to id:', err);
          }
        }
      }

      // Ensure we do NOT POST a non-UUID categoryId. If we still don't have a
      // UUID here, stop and ask the user to reload/fetch categories.
      if (!isUUID(categoryId)) {
        alert('❌ Unable to resolve a valid category ID. Please reload categories or contact support.');
        setLoading(false);
        return;
      }

      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        categoryId: categoryId,
        image: image.trim() !== "" 
          ? image.trim() 
          : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000",
      };

      const response = await API.post("/ideas", ideaData, getAuthHeader());
      
      if (response.data.success || response.status === 201) {
        alert("🎉 Green Vision Shared Successfully!");
        router.push("/dashboard/member");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to share your idea!";
      // if server validation rejected categoryId, helpfully inform the user
      if (/Invalid Category ID/i.test(errMsg) || err.response?.status === 400) {
        alert(`❌ Error: ${errMsg}. Try reloading categories or choose a different category.`);
      } else {
        alert(`❌ Error: ${errMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("waste")) return "♻️";
    if (n.includes("energy")) return "⚡";
    if (n.includes("transportation")) return "🚗";
    if (n.includes("sustainability") || n.includes("eco")) return "🌱";
    return "🌍";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex items-center justify-center px-4 py-16 font-sans grow">
        <div className="w-full max-w-2xl p-10 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:p-12">
          
          <div className="mb-10 text-center">
            <h1 className="mb-2 text-4xl font-black text-gray-900">
              Create New <span className="text-green-600">Idea</span>
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              Share your vision for a greener world
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Idea Title</label>
              <input 
                type="text" 
                placeholder="Enter your idea name..." 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            {/* Category Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Category</label>
              <div className="relative">
                <select 
                  className="w-full p-5 font-bold text-gray-800 border-none cursor-pointer bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none appearance-none" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {fetchingCategories ? (
                    <option disabled>Loading...</option>
                  ) : (
                    categories.map((cat) => (
                      // use DB id when available, otherwise fall back to name
                      <option key={cat.id || cat.name} value={cat.id || cat.name}>
                        {cat.name} {getEmoji(cat.name)}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Image URL (Optional)</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg" 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Description</label>
              <textarea 
                placeholder="Describe your idea in detail..." 
                rows={6} 
                className="w-full p-5 font-bold text-gray-800 border-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none leading-relaxed" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-5 text-lg font-black text-white bg-green-600 rounded-2xl shadow-xl hover:bg-gray-900 transition-all uppercase tracking-widest ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Processing..." : "Post My Idea 🚀"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}