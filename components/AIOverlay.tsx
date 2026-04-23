"use client";
import { useState } from "react";
import { Brain, Sparkles, Wand2, BookOpen, Hash, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIOverlayProps {
  onGenerateTitle: (topic: string) => Promise<void>;
  onGenerateContent: (topic: string, tone: string, length: string) => Promise<void>;
  onGenerateSummary: () => Promise<void>;
  onGenerateTags: () => Promise<void>;
  isGenerating: boolean;
}

export default function AIOverlay({
  onGenerateTitle,
  onGenerateContent,
  onGenerateSummary,
  onGenerateTags,
  isGenerating,
}: AIOverlayProps) {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("informative");
  const [length, setLength] = useState("medium");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
      expanded ? "w-80" : "w-16"
    )}>
      <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden ring-1 ring-indigo-500/10">
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="w-16 h-16 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />}
          </button>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold">
                <Brain className="w-5 h-5" />
                <span>AI Assistant</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <ChevronRight className="w-5 h-5 rotate-180 sm:rotate-0" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Topic / Intent</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Benefits of Next.js 14"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="creative">Creative</option>
                    <option value="informative">Informative</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  disabled={isGenerating || !topic}
                  onClick={() => onGenerateTitle(topic)}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all disabled:opacity-50"
                >
                  <Wand2 className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-600">Title</span>
                </button>
                <button
                  disabled={isGenerating || !topic}
                  onClick={() => onGenerateContent(topic, tone, length)}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all disabled:opacity-50"
                >
                  <BookOpen className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-600">Content</span>
                </button>
                <button
                  disabled={isGenerating}
                  onClick={() => onGenerateSummary()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-600">Summary</span>
                </button>
                <button
                  disabled={isGenerating}
                  onClick={() => onGenerateTags()}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all disabled:opacity-50"
                >
                  <Hash className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-600">Tags</span>
                </button>
              </div>
            </div>
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-indigo-200">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="mt-3 text-xs font-bold text-indigo-600 animate-bounce">AI Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
