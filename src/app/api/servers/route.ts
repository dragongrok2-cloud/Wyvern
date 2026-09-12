import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // If logged in — return servers the user is member of
    // If not — return all (for demo without login via /app bypass was removed by middleware)
    let servers;

    if (session?.user) {
      const userId = (session.user as any).id;
      const memberships = await prisma.serverMember.findMany({
        where: { userId },
        include: {
          server: {
            include: {
              channels: { orderBy: { position: "asc" } },
            },
          },
        },
      });
      servers = memberships.map((m) => m.server);
    } else {
      servers = await prisma.server.findMany({
        include: {
          channels: { orderBy: { position: "asc" } },
        },
      });
    }

    return NextResponse.json(servers);
  } catch (error) {
    console.error("GET servers error:", error);
    return NextResponse.json({ error: "Failed to load servers" }, { status: 500 });
  }
}
