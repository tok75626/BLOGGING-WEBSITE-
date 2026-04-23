"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Calendar, User, ArrowLeft, Loader2, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${slug}`);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading story...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Post not found</h1>
        <Link href="/" className="text-indigo-600 font-bold hover:underline">Back to feed</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
        Back to stories
      </Link>

      <header className="space-y-6 mb-12">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: any) => (
            <span key={tag.name} className="text-xs font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded">
              {tag.name}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-b border-slate-100 pb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {post.author.name?.[0] || post.author.email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{post.author.name || "Anonymous"}</p>
              <p className="text-xs text-slate-400">{post.author.email}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><MessageCircle className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      {post.summary && (
        <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-8 mb-12 rounded-r-2xl">
          <p className="text-indigo-900 italic text-lg leading-relaxed">
            {post.summary}
          </p>
        </div>
      )}

      <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-indigo-600">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <footer className="mt-20 pt-12 border-t border-slate-100">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Enjoyed this story?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Subscribe to our newsletter to get the latest AI-curated content delivered directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input type="email" placeholder="Email address" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">Subscribe</button>
          </div>
        </div>
      </footer>
    </article>
  );
}
