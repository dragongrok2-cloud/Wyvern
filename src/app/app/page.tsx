"use client";

import { useState } from "react";
import { ServerSidebar } from "@/components/server/ServerSidebar";
import { ChannelSidebar } from "@/components/server/ChannelSidebar";
import { ChatArea } from "@/components/server/ChatArea";
import { MemberList } from "@/components/server/MemberList";

export type Channel = {
  id: string;
  name: string;
  type: "text" | "voice";
  topic?: string;
};

export type Message = {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  color: string;
};

const initialChannels: Channel[] = [
  { id: "1", name: "добро-пожаловать", type: "text", topic: "Добро пожаловать в Главное Логово!" },
  { id: "2", name: "правила-логова", type: "text", topic: "Правила нашего логова" },
  { id: "3", name: "общий-чат", type: "text", topic: "Главный канал для общения драконов и наездников" },
  { id: "4", name: "мемы-и-огонь", type: "text", topic: "Мемы, скрины и огонь" },
  { id: "5", name: "голос-драконов", type: "voice" },
  { id: "6", name: "рейд-на-боссов", type: "voice" },
  { id: "7", name: "скриншоты", type: "text", topic: "Делимся красивыми моментами" },
  { id: "8", name: "идеи-для-wyvern", type: "text", topic: "Предложения по развитию Wyvern" },
];

const initialMessages: Record<string, Message[]> = {
  "3": [
    {
      id: "1",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня в 12:05",
      content: "Приветствую всех в Главном Логове! Сегодня мы начинаем строить настоящий драконий Discord.",
      color: "text-wyvern-400",
    },
    {
      id: "2",
      author: "Огненная Чешуя",
      avatar: "🔥",
      time: "Сегодня в 12:07",
      content: "Наконец-то! Я ждал этого момента. Интерфейс уже выглядит очень уютно.",
      color: "text-orange-400",
    },
    {
      id: "3",
      author: "Ночной Страж",
      avatar: "🌙",
      time: "Сегодня в 12:08",
      content: "Голосовые каналы будут с настоящим эхом пещер? 😏",
      color: "text-indigo-400",
    },
    {
      id: "4",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня в 12:10",
      content: "Обязательно. И роли с названиями вроде \"Хранитель Пламени\", \"Крылатый Разведчик\" и \"Древний Мудрец\".",
      color: "text-wyvern-400",
    },
    {
      id: "5",
      author: "Кодекс Чешуи",
      avatar: "📜",
      time: "Сегодня в 12:12",
      content: "Предлагаю сразу сделать красивые системные сообщения, когда кто-то заходит в логово.",
      color: "text-emerald-400",
    },
  ],
  "1": [
    {
      id: "w1",
      author: "Система",
      avatar: "✨",
      time: "Сегодня",
      content: "Добро пожаловать в Главное Логово Wyvern! Здесь собираются драконы и их наездники.",
      color: "text-zinc-400",
    },
  ],
  "8": [
    {
      id: "i1",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня",
      content: "Кидайте сюда любые идеи по развитию проекта. Я читаю всё.",
      color: "text-wyvern-400",
    },
  ],
};

export default function AppPage() {
  const [activeChannelId, setActiveChannelId] = useState("3");
  const [messagesByChannel, setMessagesByChannel] = useState(initialMessages);

  const activeChannel = initialChannels.find((c) => c.id === activeChannelId) || initialChannels[2];
  const messages = messagesByChannel[activeChannelId] || [];

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сейчас",
      content: content.trim(),
      color: "text-wyvern-400",
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage],
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-scale-900 text-zinc-100">
      <ServerSidebar />

      <ChannelSidebar
        channels={initialChannels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <ChatArea
          channel={activeChannel}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>

      <MemberList />
    </div>
  );
}
