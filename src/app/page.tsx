import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, ShieldCheck } from "lucide-react";
import { VolunteerRegistrationForm } from "@/components/volunteer-registration-form";

const highlights = [
  {
    icon: BadgeCheck,
    title: "Clean registration flow",
    description: "Collect volunteer details with validation and a focused UI.",
  },
  {
    icon: ShieldCheck,
    title: "JWT admin access",
    description: "Protect the dashboard with a login flow backed by signed tokens.",
  },
  {
    icon: CalendarDays,
    title: "Useful reports",
    description: "Track approvals and export volunteer data as CSV.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-200/80">Volunteer System</p>
          <h1 className="font-heading text-xl font-semibold text-white">Registration + Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-white"
          >
            Admin Login
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
            Basic, polished starter
          </span>
          <div className="space-y-4">
            <h2 className="max-w-2xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Register volunteers, review them in admin, and export reports without extra noise.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              This starter uses Next.js, MongoDB Atlas, JWT auth, and a minimal visual system built for a volunteer registration workflow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-sky-950/10 backdrop-blur">
                  <Icon className="h-5 w-5 text-sky-300" />
                  <h3 className="mt-3 font-heading text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[var(--panel)] p-4 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
          <VolunteerRegistrationForm />
        </div>
      </section>
    </main>
  );
}
