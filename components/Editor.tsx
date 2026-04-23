"use client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Eye, Edit3, Type, List, Bold, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder }: EditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("editor-main") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newVal = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newVal);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTab("write")}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              tab === "write" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Edit3 className="w-4 h-4" />
            <span>Write</span>
          </button>
          <button
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              tab === "preview" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>

        {tab === "write" && (
          <div className="hidden sm:flex items-center space-x-1 border-l border-slate-200 ml-4 pl-4 text-slate-400">
            <button onClick={() => insertText("**", "**")} className="p-1.5 hover:text-indigo-600 hover:bg-white rounded transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button onClick={() => insertText("# ")} className="p-1.5 hover:text-indigo-600 hover:bg-white rounded transition-colors" title="Heading">
              <Type className="w-4 h-4" />
            </button>
            <button onClick={() => insertText("- ")} className="p-1.5 hover:text-indigo-600 hover:bg-white rounded transition-colors" title="List">
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => insertText("`", "`")} className="p-1.5 hover:text-indigo-600 hover:bg-white rounded transition-colors" title="Code">
              <Code className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative min-h-[400px]">
        {tab === "write" ? (
          <textarea
            id="editor-main"
            className="w-full h-full min-h-[400px] p-6 text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start writing your blog post in markdown..."}
          />
        ) : (
          <div className="prose prose-slate max-w-none p-8 overflow-y-auto min-h-[400px]">
            <ReactMarkdown>{value || "_Nothing to preview yet..._"}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
