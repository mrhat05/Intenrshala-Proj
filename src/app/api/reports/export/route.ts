import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { Volunteer } from "@/models/Volunteer";

async function isAdminRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return false;
  }

  return Boolean(verifyAdminToken(token));
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const volunteers = await Volunteer.find().sort({ createdAt: -1 }).lean();

  const headers = ["First Name", "Last Name", "Email", "Phone", "Interest", "Availability", "Status", "Created At"];
  const rows = volunteers.map((volunteer) => [
    volunteer.firstName,
    volunteer.lastName,
    volunteer.email,
    volunteer.phone,
    volunteer.areaOfInterest,
    volunteer.availability,
    volunteer.status,
    new Date(volunteer.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="volunteer-report.csv"',
    },
  });
}
