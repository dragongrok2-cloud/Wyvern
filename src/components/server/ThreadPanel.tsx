"use client";

import { useState, useEffect, useRef } from "react";
import { X, Hash, Send } from "lucide-react";

type Author = {
  id: string;
  name: string;
  image: string | null;
  role: string;
  roleColor: string;
};

type ThreadMessage = {
  id: string;
  content: string;
  createdAt: string;
  edited: boolean;
  author: Author;
};

type Thread = {
  id: string;
  name: string | null;
  starterMessage: {
    id: string;
    content: string;
    author: Author;
    createdAt?: string;
  };
  messages: ThreadMessage[];
  _count: { messages: number };
};

type Props = {
  threadId: string;
  channelId: string;
  onClose: () => void;
  currentUserId?: string;
};

export function ThreadPanel({ threadId, channelId, onClose, currentUserId }: Props) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadThread = async () => {
    try {
      const res = await fetch(`/api/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setThread(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, [threadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/channels/${channelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim(), threadId }),
      });

      if (res.ok) {
        setInput("");
        await loadThread();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-96 flex flex-col bg-scale-800 border-l border-zinc-800/60 h-full">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="w-4 h-4 text-zinc-400" />
          <span className="font-semibold text-sm truncate">
            {thread?.name || "Поток"}
          </span>
          {thread && (
            <span className="text-xs text-zinc-500">
              {thread._count.messages} сообщ.
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-scale-700 text-zinc-400 hover:text-zinc-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {loading && (
          <div className="text-center text-zinc-500 text-sm py-8">Загрузка...</div>
        )}

        {thread && (
          <>
            {/* Starter message */}
            <div className="pb-4 border-b border-zinc-700/50">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-scale-700 flex items-center justify-center text-base flex-shrink-0">
                  {thread.starterMessage.author.image || "🐉"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-medium text-sm ${thread.starterMessage.author.roleColor}`}>
                      {thread.starterMessage.author.name}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 mt-0.5">
                    {thread.starterMessage.content}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-2">Начало потока</p>
                </div>
              </div>
            </div>

            {thread.messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-scale-700 flex items-center justify-center text-sm flex-shrink-0">
                  {msg.author.image || "🐉"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-medium text-sm ${msg.author.roleColor}`}>
                      {msg.author.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(msg.createdAt).toLocaleTimeString("ru", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.edited && (
                      <span className="text-[10px] text-zinc-500">(изм.)</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-200">{msg.content}</p>
                </div>
              </div>
            ))}

            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-1">
        <form onSubmit={handleSend}>
          <div className="bg-scale-700 rounded-lg flex items-center px-3 py-2 gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Написать в потоке..."
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="p-1.5 rounded text-wyvern-400 hover:text-wyvern-300 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
