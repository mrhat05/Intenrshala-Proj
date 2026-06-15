"use client";

import { useState } from "react";
import { volunteerFormSchema } from "@/lib/schemas";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  areaOfInterest: "",
  availability: "",
  motivation: "",
};

type FormState = typeof initialState;

export function VolunteerRegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [message, setMessage] = useState<string>("Complete the form and we will save your registration.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Saving registration...");

    const parsed = volunteerFormSchema.safeParse(form);
    if (!parsed.success) {
      setIsSubmitting(false);
      setMessage(parsed.error.issues[0]?.message ?? "Please check the form values.");
      return;
    }

    const response = await fetch("/api/volunteers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const responseText = await response.text();
    const payload = responseText ? JSON.parse(responseText) : {};
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Could not save the registration.");
      return;
    }

    setForm(initialState);
    setMessage("Registration saved. We will review it shortly.");
  };

  return (
    <form className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[var(--panel-strong)] p-5" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Volunteer Registration</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-white">Join the volunteer list</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">A simple form with validation, MongoDB storage, and an admin review flow.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="First name" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
        <input className="field" placeholder="Last name" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Email address" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        <input className="field" placeholder="Phone number" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="field" placeholder="Area of interest" value={form.areaOfInterest} onChange={(event) => updateField("areaOfInterest", event.target.value)} />
        <input className="field" placeholder="Availability" value={form.availability} onChange={(event) => updateField("availability", event.target.value)} />
      </div>
      <textarea className="field min-h-32" placeholder="Why do you want to volunteer?" value={form.motivation} onChange={(event) => updateField("motivation", event.target.value)} />

      <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? "Submitting..." : "Submit registration"}
      </button>
      <p className="text-sm leading-6 text-slate-300">{message}</p>
    </form>
  );
}
