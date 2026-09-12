import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🐉 Seeding Wyvern database...");

  // Clean
  await prisma.reaction.deleteMany();
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.serverMember.deleteMany();
  await prisma.server.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("dragon123", 12);

  const dragon = await prisma.user.create({
    data: {
      name: "Добрый Дракон",
      email: "dragon@wyvern.app",
      passwordHash,
      image: "🐉",
      role: "Хранитель Пламени",
      roleColor: "text-wyvern-400",
      status: "Строит Wyvern",
    },
  });

  const fire = await prisma.user.create({
    data: {
      name: "Огненная Чешуя",
      email: "fire@wyvern.app",
      passwordHash,
      image: "🔥",
      role: "Крылатый Разведчик",
      roleColor: "text-orange-400",
      status: "В голосовом",
    },
  });

  const night = await prisma.user.create({
    data: {
      name: "Ночной Страж",
      email: "night@wyvern.app",
      passwordHash,
      image: "🌙",
      role: "Древний Мудрец",
      roleColor: "text-indigo-400",
    },
  });

  const code = await prisma.user.create({
    data: {
      name: "Кодекс Чешуи",
      email: "code@wyvern.app",
      passwordHash,
      image: "📜",
      role: "Хранитель Знаний",
      roleColor: "text-emerald-400",
      status: "Пишет правила",
    },
  });

  const mainServer = await prisma.server.create({
    data: {
      name: "Главное Логово",
      icon: "🐉",
      color: "bg-wyvern-600",
      channels: {
        create: [
          { name: "добро-пожаловать", type: "text", topic: "Добро пожаловать в Главное Логово!", position: 0 },
          { name: "правила-логова", type: "text", topic: "Правила нашего логова", position: 1 },
          { name: "общий-чат", type: "text", topic: "Главный канал для общения драконов и наездников", position: 2 },
          { name: "мемы-и-огонь", type: "text", topic: "Мемы, скрины и огонь", position: 3 },
          { name: "голос-драконов", type: "voice", position: 4 },
          { name: "рейд-на-боссов", type: "voice", position: 5 },
          { name: "скриншоты", type: "text", topic: "Делимся красивыми моментами", position: 6 },
          { name: "идеи-для-wyvern", type: "text", topic: "Предложения по развитию Wyvern", position: 7 },
        ],
      },
    },
    include: { channels: true },
  });

  const fireServer = await prisma.server.create({
    data: {
      name: "Огненные Крылья",
      icon: "🔥",
      color: "bg-orange-600",
      channels: {
        create: [
          { name: "общий", type: "text", topic: "Основной чат Огненных Крыльев", position: 0 },
          { name: "тактика", type: "text", topic: "Обсуждение тактик", position: 1 },
          { name: "голос", type: "voice", position: 2 },
        ],
      },
    },
  });

  // Memberships
  for (const user of [dragon, fire, night, code]) {
    await prisma.serverMember.create({
      data: { userId: user.id, serverId: mainServer.id },
    });
    await prisma.serverMember.create({
      data: { userId: user.id, serverId: fireServer.id },
    });
  }

  const generalChannel = mainServer.channels.find((c) => c.name === "общий-чат")!;

  await prisma.message.createMany({
    data: [
      {
        content: "Приветствую всех в Главном Логове! Сегодня мы начинаем строить настоящий драконий Discord.",
        channelId: generalChannel.id,
        authorId: dragon.id,
        pinned: true,
      },
      {
        content: "Наконец-то! Я ждал этого момента. Интерфейс уже выглядит очень уютно.",
        channelId: generalChannel.id,
        authorId: fire.id,
      },
      {
        content: "Голосовые каналы будут с настоящим эхом пещер? 😏",
        channelId: generalChannel.id,
        authorId: night.id,
      },
      {
        content: "Обязательно. И роли с названиями вроде «Хранитель Пламени», «Крылатый Разведчик» и «Древний Мудрец».",
        channelId: generalChannel.id,
        authorId: dragon.id,
      },
      {
        content: "Предлагаю сразу сделать красивые системные сообщения, когда кто-то заходит в логово.",
        channelId: generalChannel.id,
        authorId: code.id,
      },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("\nDemo accounts (password: dragon123):");
  console.log("  dragon@wyvern.app  — Добрый Дракон");
  console.log("  fire@wyvern.app    — Огненная Чешуя");
  console.log("  night@wyvern.app   — Ночной Страж");
  console.log("  code@wyvern.app    — Кодекс Чешуи\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
