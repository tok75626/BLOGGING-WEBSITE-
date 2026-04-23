"use client";
import { useEffect, useState } from "react";
import { useBlog } from "@/hooks/useBlog";
import PostCard from "@/components/PostCard";
import { Search, Loader2 } from "lucide-react";

export default function Home() {
  const { posts, loading, fetchPosts } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Thoughts meet <span className="text-indigo-600">Intelligence.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          The blogging platform where AI helps you draft, summarize, and tag your content in seconds.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative pt-8">
          <input
            type="text"
            placeholder="Search amazing stories..."
            className="w-full px-6 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-[52px] text-slate-400 w-5 h-5" />
        </form>
      </section>

      {/* Post Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Latest Updates</h2>
          <div className="h-0.5 flex-1 bg-slate-100 ml-6 hidden sm:block"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 font-medium">Fetching the latest stories...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 italic">No posts found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
