"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir) {
        setRedirect(redir);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-yellow)] opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--color-yellow)] opacity-5 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-8 md:p-10 shadow-2xl z-10 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB800] via-[#FFD700] to-[#FFA500]"></div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-heading text-white mb-2 tracking-wide">
            Welcome <span className="text-[#f36c21]">Back</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Log in to manage your job applications.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-[#f36c21] transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#141414] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:border-[#f36c21] focus:ring-1 focus:ring-[#FFB800] transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-gray-400">Password</label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-[#f36c21] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#141414] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:border-[#f36c21] focus:ring-1 focus:ring-[#FFB800] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-[#f36c21] hover:bg-[#e5a600] text-black font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,184,0,0.25)] mt-4"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href={`/signup${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-[#f36c21] hover:underline font-medium transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
