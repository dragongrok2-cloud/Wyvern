"use client";

const servers = [
  { id: "1", name: "Главное Логово", initial: "🐉", color: "bg-wyvern-600" },
  { id: "2", name: "Огненные Крылья", initial: "🔥", color: "bg-orange-600" },
  { id: "3", name: "Чешуя и Код", initial: "⚔️", color: "bg-emerald-700" },
  { id: "4", name: "Ночной Патруль", initial: "🌙", color: "bg-indigo-700" },
];

export function ServerSidebar() {
  return (
    <div className="w-[72px] flex flex-col items-center py-3 gap-2 bg-scale-900 border-r border-zinc-800/50">
      {/* Кнопка домой / личные сообщения */}
      <button className="w-12 h-12 rounded-2xl bg-wyvern-500 hover:rounded-xl transition-all duration-200 flex items-center justify-center text-white text-xl shadow-lg shadow-wyvern-500/20 group relative">
        🐉
        <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          Личные сообщения
        </span>
      </button>

      <div className="w-8 h-[2px] bg-zinc-700 rounded-full my-1" />

      {servers.map((server) => (
        <button
          key={server.id}
          className={`w-12 h-12 rounded-2xl ${server.color} hover:rounded-xl transition-all duration-200 flex items-center justify-center text-xl relative group`}
        >
          {server.initial}
          <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {server.name}
          </span>
        </button>
      ))}

      {/* Добавить сервер */}
      <button className="w-12 h-12 rounded-2xl bg-scale-800 hover:bg-emerald-600 hover:rounded-xl transition-all duration-200 flex items-center justify-center text-emerald-400 hover:text-white text-2xl group relative">
        +
        <span className="absolute left-14 bg-scale-800 text-sm px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          Добавить Логово
        </span>
      </button>
    </div>
  );
}
