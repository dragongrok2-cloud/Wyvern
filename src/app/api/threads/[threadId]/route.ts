import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        starterMessage: {
          include: {
            author: {
              select: { id: true, name: true, image: true, role: true, roleColor: true },
            },
          },
        },
        messages: {
          include: {
            author: {
              select: { id: true, name: true, image: true, role: true, roleColor: true },
            },
            reactions: {
              include: { user: { select: { id: true } } },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { messages: true } },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    console.error("GET thread error:", error);
    return NextResponse.json({ error: "Failed to load thread" }, { status: 500 });
  }
}
