import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: "Database is not configured for this build. Set DATABASE_URL to a valid Postgres connection string." },
        { status: 500 }
      );
    }

    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, title: true, summary: true, level: true, topic: true },
    });
    return NextResponse.json({ courses });
  } catch (err) {
    console.error("GET /api/courses failed:", err);
    return NextResponse.json(
      { error: "Could not load courses. Is DATABASE_URL configured?" },
      { status: 500 }
    );
  }
}
