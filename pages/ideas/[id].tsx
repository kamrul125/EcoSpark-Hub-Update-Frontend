import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import API from "../../utils/api";
import toast from 'react-hot-toast';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1497215728101-856f4ea42174";

export default function IdeaDetails() {
  const router = useRouter();
  const { id: queryId, edit } = router.query; 
  const id = typeof queryId === "string" ? queryId : "";

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editData, setEditData] = useState({ title: "", description: "", image: "" });
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [relatedIdeas, setRelatedIdeas] = useState<any[]>([]);
  const [votes, setVotes] = useState(0);
  const [isVoted, setIsVoted] = useState(false);

  const getAuthHeader = () => {
    const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) setCurrentUser(JSON.parse(user));
    }
  }, []);

  const fetchIdeaDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res: any = await API.get(`/ideas/${id}`);
      const ideaData = res.data?.data || res.data;
      setIdea(ideaData);
      setComments(ideaData?.comments || []);
      setVotes(ideaData.voteCount || 0);
      
      setEditData({ 
        title: ideaData.title, 
        description: ideaData.description,
        image: ideaData.image || "" 
      });

      if (ideaData.category?.name) {
        try {
          const relatedRes = await API.get(`/ideas?category=${ideaData.category.name}&limit=4`);
          const relatedData = relatedRes.data?.data || [];
          setRelatedIdeas(relatedData.filter((i: any) => i.id !== id));
        } catch (err) {
          console.error("Related ideas fetch error:", err);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (router.isReady && id) {
      fetchIdeaDetails();
      if (edit === "true") setIsEditMode(true);
    }
  }, [id, router.isReady, fetchIdeaDetails, edit]);

  const handleUpdateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.patch(`/ideas/${id}`, editData, getAuthHeader());
      if (res.data.success) {
        alert("Success! Your idea has been updated. ✅");
        setIsEditMode(false);
        fetchIdeaDetails();
        router.push(`/ideas/${id}`, undefined, { shallow: true });
      }
    } catch (err) {
      alert("Update failed! Please check your connection.");
    }
  };

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!currentUser) {
      toast.error('Please login to cast your vote.');
      return;
    }

    try {
      const res = await API.post(`/votes/${id}`, { type }, getAuthHeader());
      if (res.data?.success) {
        // optimistic update: adjust vote count
        setVotes((prev) => (type === 'UPVOTE' ? prev + 1 : Math.max(0, prev - 1)));
        setIsVoted(type === 'UPVOTE');
        toast.success('Vote recorded');
      }
    } catch (err: any) {
      if (err.response?.status === 401) toast.error('Please login to vote.');
      else toast.error('Vote submission failed.');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser) {
      alert("Please login to join the conversation.");
      return;
    }

    try {
      const res = await API.post(
        `/comments/${id}`,
        { content: newComment },
        getAuthHeader()
      );

      if (res.data?.success) {
        const addedComment = res.data?.data;
        setComments((prev) => [addedComment, ...prev]);
        setNewComment("");
        toast.success('Comment posted');
      }
    } catch (err) {
      toast.error("Failed to post comment. Try again later.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen font-black text-emerald-600 animate-pulse text-2xl tracking-tighter italic">
      LOADING GREEN VISION...
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="w-full max-w-6xl px-6 py-12 mx-auto grow font-sans">
        
        {isEditMode ? (
          <div className="bg-white shadow-2xl rounded-4xl p-8 md:p-12 border border-indigo-50 animate-in fade-in zoom-in-95">
            <h1 className="text-3xl font-black text-gray-900 mb-10">Refine Your Vision</h1>
            <form onSubmit={handleUpdateIdea} className="space-y-8">
              
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest ml-1">Cover Image URL</label>
                <input 
                  type="text" 
                  value={editData.image}
                  onChange={(e) => setEditData({...editData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/your-image.jpg"
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800 mb-4"
                />
                {editData.image && (
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-inner bg-gray-100">
                    <img src={editData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/50 text-white text-[8px] px-2 py-1 rounded-full backdrop-blur-sm font-bold uppercase tracking-widest">Preview Mode</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest ml-1">Idea Title</label>
                <input 
                  type="text" 
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest ml-1">Full Description</label>
                <textarea 
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={8}
                  className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed font-medium text-gray-600"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="px-12 py-5 bg-gray-900 text-white text-[11px] font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl uppercase tracking-widest">SAVE CHANGES</button>
                <button type="button" onClick={() => setIsEditMode(false)} className="px-8 py-5 text-gray-400 text-[11px] font-black hover:text-rose-500 uppercase tracking-widest transition-colors">Discard</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-3 mb-10">
              <div className="md:col-span-2 bg-white shadow-2xl rounded-4xl overflow-hidden border border-gray-100">
                <div className="relative h-96 w-full overflow-hidden">
                  <img src={idea?.image || DEFAULT_IMAGE} className="object-cover w-full h-full" alt={idea?.title} />
                  <div className="absolute left-6 bottom-6 bg-black/50 text-white px-4 py-2 rounded-full font-black tracking-wider">{idea?.category?.name || 'General'}</div>
                </div>
                <div className="p-8 md:p-14">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h1 className="text-4xl font-black text-gray-900 leading-tight tracking-tight">{idea?.title}</h1>
                    {currentUser?.id === idea?.userId && (
                      <button onClick={() => setIsEditMode(true)} className="shrink-0 px-6 py-3 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-2xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest border border-indigo-100 shadow-sm">Manage Idea</button>
                    )}
                  </div>
                  <p className="text-lg text-gray-500 leading-relaxed whitespace-pre-line font-medium">{idea?.description}</p>
                </div>
              </div>

              <aside className="md:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-400 uppercase font-black tracking-widest">Votes</div>
                      <div className="text-3xl font-black text-gray-900">{votes}</div>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => handleVote('UPVOTE')} className="block px-4 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700">Upvote</button>
                      <button onClick={() => handleVote('DOWNVOTE')} className="block px-4 py-2 rounded-xl bg-white text-gray-800 border border-gray-200 hover:bg-gray-50">Downvote</button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">Status: <span className="font-black text-emerald-600">{idea?.status || 'Pending'}</span></div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-700">{idea?.user?.name?.charAt(0) || 'U'}</div>
                    <div>
                      <div className="text-sm font-black text-gray-900">{idea?.user?.name || 'Unknown Author'}</div>
                      <div className="text-xs text-gray-500">{idea?.user?.email || ''}</div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      // Try to call a join/follow endpoint; if not available, mock with toast
                      try {
                        await API.post(`/users/${idea?.userId}/follow`, {}, getAuthHeader());
                        toast.success('Joined author network');
                      } catch (err: any) {
                        toast('Joined (mock) — follow action not available on server', { icon: '✅' });
                      }
                    }}
                    className="mt-6 w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700"
                  >
                    Join Author
                  </button>
                </div>
              </aside>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-4xl shadow-xl mb-10 border border-emerald-50">
              <h3 className="mb-6 text-xl font-black text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💬</span> Share your thoughts
              </h3>
              <form onSubmit={handleAddComment} className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What's on your mind regarding this idea?"
                  className="flex-1 p-5 border-none outline-none bg-gray-50 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold placeholder:text-gray-300"
                />
                <button type="submit" className="px-10 py-5 font-black text-white bg-emerald-600 rounded-2xl hover:bg-gray-900 transition-all shadow-lg text-[11px] tracking-widest uppercase">Post</button>
              </form>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-4xl shadow-xl border border-gray-100">
              <h3 className="mb-10 text-2xl font-black text-gray-900 uppercase tracking-tighter">Community <span className="text-emerald-500">Feedback</span> ({comments.length})</h3>
              <div className="space-y-8">
                {comments.length > 0 ? comments.map((c) => (
                  <div key={c.id} className="p-7 border border-gray-50 rounded-[30px] bg-gray-50/40 hover:bg-white hover:border-emerald-50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-black text-emerald-700 shadow-sm border border-white">
                          {c.user?.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-black text-[11px] text-gray-800 uppercase tracking-widest">{c.user?.name || "Global Member"}</span>
                      </div>
                    </div>
                    <p className="leading-relaxed text-gray-600 font-medium text-sm">{c.content || c.text || c.comment}</p>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <p className="font-bold text-gray-300 italic text-lg">No feedback shared yet. Start the conversation! ✨</p>
                  </div>
                )}
              </div>
            </div>

            {relatedIdeas.length > 0 && (
              <div className="bg-white p-8 md:p-12 rounded-4xl shadow-xl border border-gray-100 mt-10">
                <h3 className="mb-8 text-2xl font-black text-gray-900 uppercase tracking-tighter">Explore <span className="text-emerald-500">Related</span> Ideas</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedIdeas.slice(0, 4).map((relatedIdea) => (
                    <Link key={relatedIdea.id} href={`/ideas/${relatedIdea.id}`} className="group block">
                      <div className="rounded-4xl border border-gray-100 bg-gray-50 p-6 transition-all hover:shadow-2xl hover:bg-white hover:scale-[1.02]">
                        <div className="aspect-video mb-4 overflow-hidden rounded-2xl bg-gray-100">
                          <img src={relatedIdea.image || DEFAULT_IMAGE} alt={relatedIdea.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900 line-clamp-2">{relatedIdea.title}</h4>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{relatedIdea.category?.name}</span>
                          <span className="text-[10px] font-black text-gray-400">👍 {relatedIdea.voteCount || 0} VOTES</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}