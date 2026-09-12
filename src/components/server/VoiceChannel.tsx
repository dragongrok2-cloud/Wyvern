"use client";

import { useEffect, useState, useRef } from "react";
import { Room, RoomEvent, Track, LocalParticipant, RemoteParticipant } from "livekit-client";
import { Mic, MicOff, PhoneOff, Volume2, Users } from "lucide-react";

type Props = {
  channelName: string;
  channelId: string;
  userName: string;
};

export function VoiceChannel({ channelName, channelId, userName }: Props) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const roomRef = useRef<Room | null>(null);

  const connect = async () => {
    setConnecting(true);
    setError(null);

    try {
      const res = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: `wyvern-${channelId}`,
          participantName: userName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Не удалось получить токен");
        setConnecting(false);
        return;
      }

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, () => updateParticipants(room));
      room.on(RoomEvent.ParticipantDisconnected, () => updateParticipants(room));
      room.on(RoomEvent.TrackSubscribed, () => updateParticipants(room));

      await room.connect(data.url, data.token);
      await room.localParticipant.setMicrophoneEnabled(true);

      setConnected(true);
      updateParticipants(room);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ошибка подключения к голосовому каналу");
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setConnected(false);
    setParticipants([]);
  };

  const toggleMute = async () => {
    if (!roomRef.current) return;
    const newMuted = !muted;
    await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuted);
    setMuted(newMuted);
  };

  const updateParticipants = (room: Room) => {
    const names: string[] = [room.localParticipant.name || "Ты"];
    room.remoteParticipants.forEach((p) => {
      names.push(p.name || p.identity);
    });
    setParticipants(names);
  };

  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <Volume2 className="w-16 h-16 mb-4 text-wyvern-400/60" />
      <h3 className="text-xl font-semibold text-zinc-100 mb-1">{channelName}</h3>
      <p className="text-sm text-zinc-400 mb-6 max-w-sm">
        Настоящий голосовой канал на LiveKit. Низкая задержка, кристальный звук.
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm max-w-md">
          {error}
          <p className="mt-2 text-xs text-red-400/80">
            Нужны ключи LiveKit. Получи бесплатно на{" "}
            <a href="https://cloud.livekit.io" target="_blank" rel="noreferrer" className="underline">
              cloud.livekit.io
            </a>{" "}
            и добавь в .env
          </p>
        </div>
      )}

      {connected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Подключён
          </div>

          {participants.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {participants.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-scale-700 border border-zinc-600 text-sm"
                >
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  {name}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                muted
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-scale-700 hover:bg-scale-600 text-zinc-200"
              }`}
              title={muted ? "Включить микрофон" : "Выключить микрофон"}
            >
              {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={disconnect}
              className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
              title="Покинуть канал"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={connecting}
          className="px-6 py-3 rounded-xl bg-wyvern-500 hover:bg-wyvern-600 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-wyvern-500/20"
        >
          {connecting ? "Подключение..." : "Присоединиться к голосу"}
        </button>
      )}
    </div>
  );
}
