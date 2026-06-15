import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth";
import { volunteerFormSchema } from "@/lib/schemas";
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
  return NextResponse.json({ volunteers });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = volunteerFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const volunteer = await Volunteer.create(parsed.data);
    return NextResponse.json({ volunteer, message: "Volunteer registered" }, { status: 201 });
  } catch (error) {
    console.error("Volunteer registration failed:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "This volunteer registration already exists." }, { status: 409 });
    }

    if (error instanceof Error && error.message.includes("MONGODB_URI is not set")) {
      return NextResponse.json(
        { error: "Database is not configured. Set MONGODB_URI in .env.local and try again." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Could not save volunteer registration." }, { status: 500 });
  }
}
