import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId, name } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: "messageId required" }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { startedThread: true },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.startedThread) {
      // already has a thread — return existing
      const thread = await prisma.thread.findUnique({
        where: { id: message.startedThread.id },
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
              reactions: true,
            },
            orderBy: { createdAt: "asc" },
          },
          _count: { select: { messages: true } },
        },
      });
      return NextResponse.json(thread);
    }

    const thread = await prisma.thread.create({
      data: {
        name: name || null,
        channelId: message.channelId,
        starterMessageId: message.id,
      },
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
            reactions: true,
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.error("Create thread error:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
