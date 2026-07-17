import React, { useState } from "react";
import Link from "next/link";
import API from "../utils/api";

interface IdeaProps {
  idea: any;
  currentUser?: { id: string; name?: string; role?: string } | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const IdeaCard = ({ idea, currentUser, onEdit, onDelete }: IdeaProps) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // ✅ ভোট স্টেট
  const initialVotes = idea.voteCount ?? idea._count?.votes ?? 0;
  const [votes, setVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const [isVoted, setIsVoted] = useState(false); 

  // ✅ কমেন্ট স্টেট
  const [comments, setComments] = useState(idea.comments || []);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyingUserName, setReplyingUserName] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const ideaId = idea.id;

  // ✅ ভোট হ্যান্ডেল
  const handleVote = async () => {
    if (!currentUser || isVoting) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;

    if (!token) {
      alert("দয়া করে প্রথমে লগইন করুন।");
      return;
    }

    try {
      setIsVoting(true);
      const res = await API.post(`/votes/${ideaId}`, { type: "UPVOTE" });
      if (res.data?.success) {
        if (isVoted) {
          setVotes((prev: number) => prev - 1);
          setIsVoted(false);
        } else {
          setVotes((prev: number) => prev + 1);
          setIsVoted(true);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("প্রমাণীকরণ ব্যর্থ হয়েছে। দয়া করে আবার লগইন করুন।");
      }
      console.error("Vote failed", err);
    } finally {
      setIsVoting(false);
    }
  };

  // ✅ কমেন্ট সাবমিট/আপডেট হ্যান্ডেল
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      if (!token) return alert("লগইন করুন! 😊");

      if (editingCommentId) {
        // Edit Logic
        const res = await API.patch(`/comments/${editingCommentId}`, 
          { content: commentText },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          const updatedComment = res.data.data;
          setComments((prev: any[]) =>
            prev.map((c) => {
              if (c.id === editingCommentId) return { ...c, content: updatedComment.content };
              if (c.replies) {
                return {
                  ...c,
                  replies: c.replies.map((r: any) => 
                    r.id === editingCommentId ? { ...r, content: updatedComment.content } : r
                  )
                };
              }
              return c;
            })
          );
          setEditingCommentId(null);
        }
      } else {
        // Post New Comment or Reply
        const res = await API.post(`/comments/${ideaId}`,
          { content: commentText, parentId: replyToId || null },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.success) {
          const newComment = res.data.data;
          if (replyToId) {
            setComments((prev: any[]) =>
              prev.map((c) =>
                c.id === replyToId ? { ...c, replies: [...(c.replies || []), newComment] } : c
              )
            );
          } else {
            setComments((prev: any[]) => [...prev, newComment]);
          }
        }
      }
      setCommentText("");
      setReplyToId(null);
      setReplyingUserName(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "ব্যর্থ হয়েছে।");
    }
  };

  // ✅ কমেন্ট ডিলিট হ্যান্ডেল
  const handleDeleteComment = async (commentId: string, isReply: boolean, parentId?: string) => {
    if (!confirm("আপনি কি নিশ্চিত?")) return;
    try {
      const token = typeof window !== "undefined" ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) : null;
      await API.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

      if (isReply && parentId) {
        setComments((prev: any[]) =>
          prev.map((c) =>
            c.id === parentId ? { ...c, replies: c.replies.filter((r: any) => r.id !== commentId) } : c
          )
        );
      } else {
        setComments((prev: any[]) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err: any) { alert("ডিলিট করা যায়নি।"); }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={idea.image || "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=900&q=80"}
          alt={idea.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 gap-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
              {idea.category?.name || idea.category || "General"}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {new Date(idea.createdAt || idea.updatedAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 leading-tight line-clamp-2">{idea.title}</h3>
          <p className="text-sm leading-6 text-slate-600 line-clamp-3">
            {typeof idea.description === "string" ? idea.description : "No description provided."}
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{votes} votes</span>
            <span>{idea.author?.name || "Creator"}</span>
          </div>
          <Link
            href={`/ideas/${ideaId}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            View Details
          </Link>
        </div>
      </div>

        {/* কমেন্ট বক্স সেকশন */}
        {showCommentBox && (
          <div className="pt-4 mt-4 space-y-4 border-t">
            <div className="pr-1 space-y-4 overflow-y-auto max-h-80 custom-scrollbar">
              {comments.filter((c: any) => !c.parentId).map((mainComment: any) => (
                <div key={mainComment.id} className="flex flex-col gap-2 mb-4">
                  {/* মেইন কমেন্ট */}
                  <div className="p-4 border border-gray-100 bg-gray-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-indigo-600 uppercase">{mainComment.user?.name}</span>
                      <div className="flex gap-2">
                        {(currentUser?.id === mainComment.userId || currentUser?.role === 'ADMIN') && (
                          <>
                            <button onClick={() => { setEditingCommentId(mainComment.id); setCommentText(mainComment.content); }} className="text-[9px] font-bold text-gray-500 hover:text-indigo-600 transition-colors">EDIT</button>
                            <button onClick={() => handleDeleteComment(mainComment.id, false)} className="text-[9px] font-bold text-rose-500 hover:text-rose-700 transition-colors">DELETE</button>
                          </>
                        )}
                        <button onClick={() => { setReplyToId(mainComment.id); setReplyingUserName(mainComment.user?.name); setEditingCommentId(null); }} className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-1 rounded-lg hover:bg-blue-200 transition-all">REPLY</button>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-800 font-medium">{mainComment.content}</p>
                  </div>

                  {/* রিপ্লাই লিস্ট */}
                  {mainComment.replies?.map((reply: any) => (
                    <div key={reply.id} className="flex items-start justify-between p-3 ml-8 border border-indigo-100 bg-indigo-50/50 rounded-xl">
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-emerald-600 block">{reply.user?.name}</span>
                        <p className="text-[12px] text-gray-700">{reply.content}</p>
                      </div>
                      {(currentUser?.id === reply.userId || currentUser?.role === 'ADMIN') && (
                        <div className="flex gap-2 ml-2">
                          <button onClick={() => { setEditingCommentId(reply.id); setCommentText(reply.content); }} className="text-[9px] font-bold text-gray-400 hover:text-indigo-600">EDIT</button>
                          <button onClick={() => handleDeleteComment(reply.id, true, mainComment.id)} className="text-[9px] font-bold text-rose-400 hover:text-rose-600">🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* কমেন্ট/রিপ্লাই/এডিট ইনপুট বক্স */}
            <div className="flex flex-col gap-2 p-3 bg-gray-100 shadow-inner rounded-2xl">
              {(replyingUserName || editingCommentId) && (
                <div className="flex items-center justify-between px-3 py-1 bg-indigo-100 rounded-lg">
                  <span className="text-[10px] font-bold text-indigo-700">
                    {editingCommentId ? "Editing your comment..." : `Replying to ${replyingUserName}`}
                  </span>
                  <button onClick={() => { setReplyToId(null); setEditingCommentId(null); setCommentText(""); setReplyingUserName(null); }} className="text-xs font-black transition-transform text-rose-500 hover:scale-110">✕</button>
                </div>
              )}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)} 
                  placeholder="আপনার মতামত লিখুন..." 
                  className="flex-1 px-4 py-2 text-sm text-black bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
                <button 
                  onClick={handleCommentSubmit} 
                  className="px-5 py-2 text-xs font-black text-white transition-all bg-indigo-600 shadow-md rounded-xl hover:bg-indigo-700 active:scale-95"
                >
                  {editingCommentId ? "UPDATE" : replyToId ? "REPLY" : "POST"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default IdeaCard;