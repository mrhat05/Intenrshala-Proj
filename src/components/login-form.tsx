"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  nextPath?: string;
  adminEmail?: string;
  adminPassword?: string;
};

export function LoginForm({ nextPath, adminEmail, adminPassword }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Sign in with the admin credentials from your environment variables.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Signing in...");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Login failed.");
      return;
    }

    router.push(nextPath ?? "/admin");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-10">
      <div className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-white/10 bg-[var(--panel)] p-8 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin Access</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-white">Login</h1>
          </div>
          <input className="field" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="field" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button disabled={isSubmitting} className="w-full rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-sm leading-6 text-slate-300">{message}</p>
        </form>

        <section className="rounded-[1.5rem] border border-sky-300/20 bg-sky-400/10 p-5 text-slate-100 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Testing details</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            <p>
              Admin email: <span className="font-semibold text-white">{adminEmail ?? "Set ADMIN_EMAIL in .env.local"}</span>
            </p>
            <p>
              Admin password: <span className="font-semibold text-white">{adminPassword ?? "Set ADMIN_PASSWORD in .env.local"}</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}