"use client";

import type { Server } from "@/app/app/page";

type Props = {
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
};

export function ServerSidebar({ servers, activeServerId, onSelectServer }: Props) {
  return (
    <div className="w-[72px] flex flex-col items-center py-3 gap-2 bg-scale-900 border-r border-zinc-800/50">
      {/* Кнопка домой / личные сообщения */}
      <button className="w-12 h-12 rounded-2xl bg-wyvern-500 hover:rounded-xl transition-all duration-200 flex items-center justify-center text-white text-xl shadow-lg shadow-wyvern-500/20 group relative">
        🐉
        <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl">
          Личные сообщения
        </span>
      </button>

      <div className="w-8 h-[2px] bg-zinc-700 rounded-full my-1" />

      {servers.map((server) => {
        const isActive = server.id === activeServerId;

        return (
          <button
            key={server.id}
            onClick={() => onSelectServer(server.id)}
            className={`w-12 h-12 ${server.color} flex items-center justify-center text-xl relative group transition-all duration-200 ${
              isActive
                ? "rounded-xl ring-2 ring-white/30 scale-105"
                : "rounded-2xl hover:rounded-xl"
            }`}
          >
            {server.initial}
            {/* Active indicator */}
            {isActive && (
              <div className="absolute -left-3 w-1.5 h-8 bg-white rounded-r-full" />
            )}
            <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl">
              {server.name}
            </span>
          </button>
        );
      })}

      {/* Добавить сервер */}
      <button className="w-12 h-12 rounded-2xl bg-scale-800 hover:bg-emerald-600 hover:rounded-xl transition-all duration-200 flex items-center justify-center text-emerald-400 hover:text-white text-2xl group relative">
        +
        <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl">
          Добавить Логово
        </span>
      </button>
    </div>
  );
}
