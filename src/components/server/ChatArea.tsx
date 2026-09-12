"use client";

import { Hash, Bell, Pin, Users, Search, Inbox, HelpCircle, PlusCircle, Gift, Sticker, Smile } from "lucide-react";

const messages = [
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
];

export function ChatArea() {
  return (
    <div className="flex flex-col h-full bg-scale-800/40">
      {/* Шапка канала */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 shadow-sm bg-scale-800/60">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-zinc-400" />
          <span className="font-semibold">общий-чат</span>
          <div className="w-px h-5 bg-zinc-700 mx-2" />
          <span className="text-sm text-zinc-400 truncate hidden sm:inline">
            Главный канал для общения драконов и наездников
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <button className="hover:text-zinc-200 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hover:text-zinc-200 transition-colors">
            <Pin className="w-5 h-5" />
          </button>
          <button className="hover:text-zinc-200 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Поиск"
              className="w-36 bg-scale-900 text-sm rounded px-8 py-1 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-wyvern-500/50"
            />
          </div>
          <button className="hover:text-zinc-200 transition-colors">
            <Inbox className="w-5 h-5" />
          </button>
          <button className="hover:text-zinc-200 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Приветственное сообщение */}
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-wyvern-600/20 flex items-center justify-center text-3xl mb-4">
            #
          </div>
          <h3 className="text-2xl font-bold mb-1">Добро пожаловать в #общий-чат!</h3>
          <p className="text-zinc-400 text-sm max-w-md">
            Это начало истории Главного Логова. Здесь драконы собираются, чтобы рычать, шутить и строить будущее Wyvern.
          </p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4 hover:bg-scale-800/40 px-2 py-1 rounded group">
            <div className="w-10 h-10 rounded-full bg-scale-700 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
              {msg.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`font-medium ${msg.color}`}>{msg.author}</span>
                <span className="text-xs text-zinc-500">{msg.time}</span>
              </div>
              <p className="text-zinc-200 leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-scale-700 rounded-lg flex items-center px-4 py-3 gap-3">
          <button className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <PlusCircle className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="Написать в #общий-чат"
            className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="hover:text-zinc-200 transition-colors">
              <Gift className="w-5 h-5" />
            </button>
            <button className="hover:text-zinc-200 transition-colors">
              <Sticker className="w-5 h-5" />
            </button>
            <button className="hover:text-zinc-200 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
