import Link from "next/link";
import { VolunteerRegistrationForm } from "@/components/volunteer-registration-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Volunteer onboarding</p>
          <h1 className="font-heading text-4xl font-semibold text-white">Register to volunteer</h1>
          <p className="text-sm leading-7 text-slate-300">
            Use this page if you want a direct registration route separate from the homepage.
          </p>
          <Link href="/" className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-white">
            Back home
          </Link>
        </section>
        <VolunteerRegistrationForm />
      </div>
    </main>
  );
}
