"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-yellow)] opacity-5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[var(--color-yellow)] opacity-5 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-2xl p-8 shadow-2xl z-10 relative overflow-hidden">

        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-yellow-dark)] via-[var(--color-yellow)] to-[var(--color-yellow-light)]"></div>

        <div className="text-center mb-8 mt-2">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="S Kumar Infracons" className="h-[60px] w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-[#183964] mb-2 uppercase tracking-wider">
            Admin <span className="text-[var(--color-yellow)]">Portal</span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm">
            Sign in to access the S Kumar Infracons (India) Private Limited dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-body)] ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[var(--color-muted)]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-secondary)] border border-[var(--color-dark-border)] rounded-xl text-[#183964] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] transition-all duration-300"
                placeholder="[EMAIL_ADDRESS]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium text-[var(--color-body)]">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[var(--color-muted)]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-dark-secondary)] border border-[var(--color-dark-border)] rounded-xl text-[#183964] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-yellow)] hover:bg-[var(--color-yellow-light)] text-[var(--color-dark)] font-heading font-semibold text-sm tracking-widest uppercase rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,184,0,0.25)]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-muted)]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[var(--color-yellow)] hover:underline font-medium transition-colors">
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
