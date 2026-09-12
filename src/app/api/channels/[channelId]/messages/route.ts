import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const { channelId } = await params;

    const messages = await prisma.message.findMany({
      where: {
        channelId,
        threadId: null, // only top-level messages
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            roleColor: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            author: { select: { name: true } },
          },
        },
        reactions: {
          include: {
            user: { select: { id: true } },
          },
        },
        startedThread: {
          select: { id: true, _count: { select: { messages: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelId } = await params;
    const body = await req.json();
    const { content, replyToId, threadId } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        channelId,
        authorId: userId,
        replyToId: replyToId || null,
        threadId: threadId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            roleColor: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            author: { select: { name: true } },
          },
        },
        reactions: true,
        startedThread: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
