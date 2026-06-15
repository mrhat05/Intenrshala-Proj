import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Download, LogOut, Users, UserCheck2, UserX } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { Volunteer } from "@/models/Volunteer";

type DashboardVolunteer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  areaOfInterest: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
};

async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

async function getDashboardData() {
  await connectToDatabase();

  const [total, approved, declined, pending, recent] = await Promise.all([
    Volunteer.countDocuments(),
    Volunteer.countDocuments({ status: "approved" }),
    Volunteer.countDocuments({ status: "declined" }),
    Volunteer.countDocuments({ status: "pending" }),
    Volunteer.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  return {
    total,
    approved,
    declined,
    pending,
    recent: recent.map((item) => ({
      _id: String(item._id),
      firstName: String(item.firstName),
      lastName: String(item.lastName),
      email: String(item.email),
      areaOfInterest: String(item.areaOfInterest),
      status: item.status,
      createdAt: String(item.createdAt),
    })) as DashboardVolunteer[],
  };
}

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login?next=/admin");
  }

  const data = await getDashboardData();

  const cards = [
    { label: "Total registrations", value: data.total, icon: Users },
    { label: "Approved", value: data.approved, icon: UserCheck2 },
    { label: "Pending", value: data.pending, icon: Users },
    { label: "Declined", value: data.declined, icon: UserX },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[var(--panel)] p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin Dashboard</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-white">Volunteer overview</h1>
          <p className="mt-2 text-sm text-slate-300">Signed in as {session.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/api/reports/export" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-white">
            <Download className="h-4 w-4" />
            Export CSV
          </Link>
          <Link href="/api/auth/logout" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white">
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">{card.label}</p>
                <Icon className="h-5 w-5 text-sky-300" />
              </div>
              <p className="mt-4 font-heading text-4xl font-semibold text-white">{card.value}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-[2rem] border border-white/10 bg-[var(--panel)] p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-white">Recent volunteers</h2>
            <p className="mt-1 text-sm text-slate-300">Review and manage the latest registrations.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-sky-300 transition hover:text-sky-200">
            Back to registration
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Interest</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((item) => (
                <tr key={item._id} className="border-t border-white/10 bg-slate-950/10 text-slate-200">
                  <td className="px-4 py-3">
                    {item.firstName} {item.lastName}
                    <div className="text-xs text-slate-400">{item.email}</div>
                  </td>
                  <td className="px-4 py-3">{item.areaOfInterest}</td>
                  <td className="px-4 py-3 capitalize">{item.status}</td>
                  <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
