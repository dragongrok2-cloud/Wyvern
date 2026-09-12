"use client";

import { Hash, Volume2, ChevronDown, Settings, Plus } from "lucide-react";

const categories = [
  {
    name: "Информация",
    channels: [
      { id: "1", name: "добро-пожаловать", type: "text" as const },
      { id: "2", name: "правила-логова", type: "text" as const },
    ],
  },
  {
    name: "Общение",
    channels: [
      { id: "3", name: "общий-чат", type: "text" as const, active: true },
      { id: "4", name: "мемы-и-огонь", type: "text" as const },
      { id: "5", name: "голос-драконов", type: "voice" as const },
      { id: "6", name: "рейд-на-боссов", type: "voice" as const },
    ],
  },
  {
    name: "Творчество",
    channels: [
      { id: "7", name: "скриншоты", type: "text" as const },
      { id: "8", name: "идеи-для-wyvern", type: "text" as const },
    ],
  },
];

export function ChannelSidebar() {
  return (
    <div className="w-60 flex flex-col bg-scale-800 border-r border-zinc-800/60">
      {/* Заголовок сервера */}
      <button className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 hover:bg-scale-700/50 transition-colors shadow-sm">
        <span className="font-semibold text-[15px] truncate">Главное Логово</span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>

      {/* Список каналов */}
      <div className="flex-1 overflow-y-auto pt-3 pb-4 px-2 space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between px-1 mb-1 group">
              <button className="flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 hover:text-zinc-300">
                <ChevronDown className="w-3 h-3" />
                {category.name}
              </button>
              <Plus className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-300" />
            </div>

            <div className="space-y-0.5">
              {category.channels.map((channel) => (
                <button
                  key={channel.id}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[15px] transition-colors ${
                    channel.active
                      ? "bg-scale-700/80 text-white"
                      : "text-zinc-400 hover:bg-scale-700/40 hover:text-zinc-200"
                  }`}
                >
                  {channel.type === "text" ? (
                    <Hash className="w-4 h-4 flex-shrink-0 text-zinc-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 flex-shrink-0 text-zinc-500" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Панель пользователя внизу */}
      <div className="h-[52px] bg-scale-900/80 px-2 flex items-center gap-2 border-t border-zinc-800/50">
        <div className="w-8 h-8 rounded-full bg-wyvern-600 flex items-center justify-center text-sm">
          🐉
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate leading-tight">Добрый Дракон</div>
          <div className="text-xs text-zinc-400 truncate">В сети</div>
        </div>
        <button className="p-1.5 rounded hover:bg-scale-700 text-zinc-400 hover:text-zinc-200">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
