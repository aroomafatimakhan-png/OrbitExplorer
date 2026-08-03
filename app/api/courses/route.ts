import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
