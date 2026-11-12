"use client";

import { useEffect, useState } from "react";
import type { Member } from "@/app/app/page";
import {
  type PresenceStatus,
  PRESENCE_LABELS,
  PRESENCE_DOT,
  nextPresence,
} from "@/lib/presence";
import { getSocket } from "@/lib/socket";

type Props = {
  members: Member[];
};

function toPresence(member: Member): PresenceStatus {
  if (!member.online) return "offline";
  const s = (member.status || "").toLowerCase();
  if (s.includes("лет") || s.includes("fly")) return "flying";
  if (s.includes("не беспоко") || s.includes("dnd") || s.includes("do not")) return "dnd";
  return "online";
}

export function MemberList({ members }: Props) {
  const [localMembers, setLocalMembers] = useState(() =>
    members.map((m) => ({
      ...m,
      presence: toPresence(m),
    }))
  );

  useEffect(() => {
    const socket = getSocket();

    const onPresence = (data: { name: string; presence: PresenceStatus }) => {
      setLocalMembers((prev) =>
        prev.map((m) =>
          m.name === data.name
            ? { ...m, presence: data.presence, online: data.presence !== "offline" }
            : m
        )
      );
    };

    socket.on("presence:update", onPresence);

    return () => {
      socket.off("presence:update", onPresence);
    };
  }, []);

  const cycle = (name: string) => {
    setLocalMembers((prev) => {
      const next = prev.map((m) => {
        if (m.name !== name) return m;
        const presence = nextPresence(m.presence);
        return { ...m, presence, online: presence !== "offline" };
      });

      const updated = next.find((m) => m.name === name);
      if (updated) {
        getSocket().emit("presence:update", {
          name: updated.name,
          presence: updated.presence,
        });
      }

      return next;
    });
  };

  const online = localMembers.filter((m) => m.presence !== "offline");
  const offline = localMembers.filter((m) => m.presence === "offline");

  const renderMember = (member: (typeof localMembers)[number], isOffline = false) => (
    <div
      key={member.name}
      className={`flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-scale-700/50 cursor-pointer group ${
        isOffline ? "opacity-60 hover:opacity-100 transition-opacity" : ""
      }`}
      onClick={() => cycle(member.name)}
      title="Нажми, чтобы сменить статус присутствия"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-scale-700 flex items-center justify-center text-sm">
          {member.avatar}
        </div>
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-scale-800 ${PRESENCE_DOT[member.presence]}`}
        />
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-medium truncate ${isOffline ? "text-zinc-400" : member.roleColor}`}>
          {member.name}
        </div>
        <div className="text-[11px] text-zinc-500 truncate">
          {member.role}
          {" · "}{PRESENCE_LABELS[member.presence]}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-60 bg-scale-800 border-l border-zinc-800/60 hidden xl:flex flex-col">
      <div className="flex-1 overflow-y-auto pt-6 px-3 pb-4">
        {/* Онлайн */}
        <div className="mb-6">
          <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
            В сети — {online.length}
          </h3>
          <div className="space-y-1">{online.map((m) => renderMember(m))}</div>
        </div>

        {/* Оффлайн */}
        {offline.length > 0 && (
          <div>
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-2">
              Не в сети — {offline.length}
            </h3>
            <div className="space-y-1">{offline.map((m) => renderMember(m, true))}</div>
          </div>
        )}
      </div>
    </div>
  );
}
