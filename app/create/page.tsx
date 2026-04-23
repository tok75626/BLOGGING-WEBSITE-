"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useBlog } from "@/hooks/useBlog";
import Editor from "@/components/Editor";
import AIOverlay from "@/components/AIOverlay";
import { Save, Tag as TagIcon, Layout, FileText, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  const router = useRouter();
  const { generateAI, generating } = useBlog();

  const handleAI = async (type: "title" | "content" | "summary" | "tags", data: any) => {
    try {
      const result = await generateAI(type, data);
      if (type === "title") setTitle(result.title);
      if (type === "content") setContent(result.content);
      if (type === "summary") setSummary(result.summary);
      if (type === "tags") setTags(result.tags);
    } catch (err) {
      console.error("AI Generation failed", err);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      await axios.post("/api/posts", {
        title,
        content,
        summary,
        tags,
        published: isPublished,
      });
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
            <Layout className="w-8 h-8 mr-3 text-indigo-600" />
            Create New Post
          </h1>
          <p className="text-slate-500 mt-1">Draft your next masterpiece with AI assistance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Published</span>
          </label>
          <button
            onClick={handleSave}
            disabled={status === "saving" || !title || !content}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
              status === "success" 
                ? "bg-green-500 text-white shadow-green-100" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 disabled:opacity-50"
            )}
          >
            {status === "saving" ? (
              <span className="animate-pulse">Saving...</span>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Save Post</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Post Title"
              className="w-full text-4xl md:text-5xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 text-slate-900 leading-tight outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="absolute -bottom-2 left-0 w-0 h-1 bg-indigo-600 group-focus-within:w-20 transition-all duration-500"></div>
          </div>

          <Editor value={content} onChange={setContent} />
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Summary
            </h3>
            <textarea
              className="w-full h-32 bg-slate-50 rounded-xl p-4 text-sm text-slate-600 border border-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              placeholder="Short description for social media and SEO..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <TagIcon className="w-4 h-4 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-indigo-500/10">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 hover:text-indigo-800">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              className="w-full px-4 py-2 bg-slate-50 rounded-xl text-sm border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
            />
          </div>
        </div>
      </div>

      <AIOverlay
        onGenerateTitle={topic => handleAI("title", { topic })}
        onGenerateContent={(topic, tone, length) => handleAI("content", { topic, tone, length })}
        onGenerateSummary={() => handleAI("summary", { content })}
        onGenerateTags={() => handleAI("tags", { content })}
        isGenerating={generating}
      />
    </div>
  );
}
