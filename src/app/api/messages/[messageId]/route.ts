import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await params;
    const body = await req.json();
    const userId = (session.user as any).id;

    const existing = await prisma.message.findUnique({ where: { id: messageId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Edit content — only author
    if (body.content !== undefined) {
      if (existing.authorId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { content: body.content.trim(), edited: true },
        include: {
          author: {
            select: { id: true, name: true, image: true, role: true, roleColor: true },
          },
          reactions: true,
        },
      });
      return NextResponse.json(updated);
    }

    // Toggle pin — any authenticated user for demo
    if (body.pinned !== undefined) {
      const updated = await prisma.message.update({
        where: { id: messageId },
        data: { pinned: body.pinned },
        include: {
          author: {
            select: { id: true, name: true, image: true, role: true, roleColor: true },
          },
          reactions: true,
        },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (error) {
    console.error("PATCH message error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await params;
    const userId = (session.user as any).id;

    const existing = await prisma.message.findUnique({ where: { id: messageId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.message.delete({ where: { id: messageId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
