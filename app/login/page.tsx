"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { Brain, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setUser(data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-100 p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to manage your AI stories</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="yours@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 shadow-lg shadow-indigo-200"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
