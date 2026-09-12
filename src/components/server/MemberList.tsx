"use client";

import type { Member } from "@/app/app/page";

type Props = {
  members: Member[];
};

export function MemberList({ members }: Props) {
  const online = members.filter((m) => m.online);
  const offline = members.filter((m) => !m.online);

  return (
    <div className="w-60 bg-scale-800 border-l border-zinc-800/60 hidden xl:flex flex-col">
      <div className="flex-1 overflow-y-auto pt-6 px-3 pb-4">
        {/* Онлайн */}
        <div className="mb-6">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            В сети — {online.length}
          </h3>
          <div className="space-y-1">
            {online.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-scale-700/50 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-scale-700 flex items-center justify-center text-sm">
                    {member.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-scale-800" />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${member.roleColor}`}>
                    {member.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {member.role}
                    {member.status ? ` · ${member.status}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Оффлайн */}
        <div>
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            Не в сети — {offline.length}
          </h3>
          <div className="space-y-1">
            {offline.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-scale-700/50 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-scale-700 flex items-center justify-center text-sm">
                  {member.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate text-zinc-400">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
