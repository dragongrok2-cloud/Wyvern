import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Заполни все поля" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль минимум 6 символов" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Такой email уже занят" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        image: "🐉",
        role: "Наездник",
        roleColor: "text-wyvern-400",
      },
    });

    // Auto-join the main server if it exists
    const mainServer = await prisma.server.findFirst({
      where: { name: "Главное Логово" },
    });

    if (mainServer) {
      await prisma.serverMember.create({
        data: {
          userId: user.id,
          serverId: mainServer.id,
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
