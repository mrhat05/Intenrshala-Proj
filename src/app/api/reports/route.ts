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

  const [total, approved, pending, declined, byInterest] = await Promise.all([
    Volunteer.countDocuments(),
    Volunteer.countDocuments({ status: "approved" }),
    Volunteer.countDocuments({ status: "pending" }),
    Volunteer.countDocuments({ status: "declined" }),
    Volunteer.aggregate([
      { $group: { _id: "$areaOfInterest", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  return NextResponse.json({
    summary: { total, approved, pending, declined },
    byInterest,
  });
}
