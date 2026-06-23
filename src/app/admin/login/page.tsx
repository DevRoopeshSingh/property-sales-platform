import type { Metadata } from "next";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login — PropConnect",
  robots: { index: false, follow: false },
};

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

        {/* Login Card */}
        <div className="card p-8">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Sign in to manage your property listings and leads.
          </p>

          <form className="space-y-4">
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
              />
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="btn btn-primary w-full py-3"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg text-xs text-center" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
            🔒 This area is restricted to authorized administrators only.
          </div>
        </div>
      </div>
    </div>
  );
}
