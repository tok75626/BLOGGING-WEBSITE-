"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Plus, FileEdit, Trash2, Globe, Lock, BarChart3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await axios.get("/api/posts/me");
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Layout className="w-8 h-8 mr-3 text-indigo-600" />
            Creator Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Manage and monitor your published content</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          <span>New AI Story</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{posts.length}</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Posts</p>
          </div>
        </div>
        {/* Placeholders for more stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{posts.filter(p => p.published).length}</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{posts.filter(p => !p.published).length}</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drafts</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Title</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Created</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-slate-400">Loading your content...</p>
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</span>
                        <span className="text-xs text-slate-400 mt-0.5">/{post.slug}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {post.published ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-600">
                          <Globe className="w-3 h-3 mr-1.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-500">
                          <Lock className="w-3 h-3 mr-1.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* We would have an edit page /edit/[id] */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-indigo-100"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-slate-400 italic">No posts yet. Start by creating one!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
