"use client";

import { Suspense, useState } from "react";
import { Building2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Sign in to manage your property listings and leads.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <div>
          <label
            htmlFor="admin-email"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
          >
            Email Address
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@propconnect.in"
            className="input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
          >
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          id="admin-login-submit"
          className="btn btn-primary w-full py-3 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="inline-block animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            "Sign In to Admin Panel"
          )}
        </button>
      </form>

      <div className="mt-6 p-3 rounded-lg text-xs text-center" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
        🔒 This area is restricted to authorized administrators only.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--color-text-primary)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--color-brand-600)" }}
            >
              <Building2 size={24} color="white" />
            </div>
            <span className="font-extrabold text-2xl text-white">
              Prop<span style={{ color: "var(--color-brand-400)" }}>Connect</span>
            </span>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Admin Panel
          </p>
        </div>

        {/* Login Card inside Suspense */}
        <Suspense fallback={
          <div className="card p-8 flex justify-center items-center">
            <span className="inline-block animate-spin w-8 h-8 border-4 border-[var(--color-brand-600)] border-t-transparent rounded-full" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
