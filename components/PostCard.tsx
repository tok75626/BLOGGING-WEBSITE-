import Link from "next/link";
import { Calendar, User, ArrowRight, Tag as TagIcon } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    createdAt: string;
    author: { name: string | null; email: string };
    tags: { name: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag.name}
              className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-1 rounded"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.summary || "Read the full article to learn more about this topic..."}
        </p>
      </div>

      <div className="pt-6 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{post.author.name || "Anonymous"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center text-indigo-600 text-sm font-semibold group/link"
          >
            <span>Read</span>
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
