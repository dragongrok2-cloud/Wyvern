"use client";

import { useState, useRef, useEffect } from "react";
import {
  Hash,
  Volume2,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
  PlusCircle,
  Gift,
  Sticker,
  Smile,
} from "lucide-react";
import type { Channel, Message } from "@/app/app/page";

type Props = {
  channel: Channel;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
};

const QUICK_EMOJIS = ["🔥", "🐉", "❤️", "✨", "😂", "👍"];

export function ChatArea({
  channel,
  messages,
  onSendMessage,
  onToggleReaction,
}: Props) {
  const [input, setInput] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const isVoice = channel.type === "voice";

  return (
    <div className="flex flex-col h-full bg-scale-800/40">
      {/* Шапка канала */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/80 shadow-sm bg-scale-800/60">
        <div className="flex items-center gap-2 min-w-0">
          {isVoice ? (
            <Volume2 className="w-5 h-5 text-zinc-400 flex-shrink-0" />
          ) : (
            <Hash className="w-5 h-5 text-zinc-400 flex-shrink-0" />
          )}
          <span className="font-semibold truncate">{channel.name}</span>
          {channel.topic && (
            <>
              <div className="w-px h-5 bg-zinc-700 mx-2 flex-shrink-0" />
              <span className="text-sm text-zinc-400 truncate hidden sm:inline">
                {channel.topic}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-zinc-400 flex-shrink-0">
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
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isVoice ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
            <Volume2 className="w-16 h-16 mb-4 opacity-40" />
            <h3 className="text-xl font-semibold text-zinc-200 mb-2">
              {channel.name}
            </h3>
            <p className="text-sm max-w-sm">
              Голосовой канал. Скоро здесь будет настоящий звук драконов.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8 text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-wyvern-600/20 flex items-center justify-center text-3xl mb-4">
                #
              </div>
              <h3 className="text-2xl font-bold mb-1">
                Добро пожаловать в #{channel.name}!
              </h3>
              <p className="text-zinc-400 text-sm max-w-md">
                {channel.topic ||
                  "Это начало истории канала. Здесь драконы собираются, чтобы рычать и строить будущее Wyvern."}
              </p>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex gap-4 hover:bg-scale-800/40 px-2 py-1.5 rounded group relative"
                >
                  <div className="w-10 h-10 rounded-full bg-scale-700 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                    {msg.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-medium ${msg.color}`}>
                        {msg.author}
                      </span>
                      <span className="text-xs text-zinc-500">{msg.time}</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed">{msg.content}</p>

                    {/* Reactions */}
                    {(msg.reactions && msg.reactions.length > 0) || true ? (
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {msg.reactions?.map((r) => (
                          <button
                            key={r.emoji}
                            onClick={() => onToggleReaction(msg.id, r.emoji)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs transition-colors ${
                              r.reacted
                                ? "bg-wyvern-500/20 border border-wyvern-500/40 text-wyvern-300"
                                : "bg-scale-700/80 border border-transparent hover:border-zinc-600 text-zinc-300"
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="font-medium">{r.count}</span>
                          </button>
                        ))}

                        {/* Add reaction button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowReactionPicker(
                                showReactionPicker === msg.id ? null : msg.id
                              )
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-scale-700 text-zinc-400 hover:text-zinc-200 transition-all"
                          >
                            <Smile className="w-4 h-4" />
                          </button>

                          {showReactionPicker === msg.id && (
                            <div className="absolute bottom-full left-0 mb-1 flex gap-1 p-1.5 bg-scale-800 border border-zinc-700 rounded-xl shadow-xl z-20">
                              {QUICK_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => {
                                    onToggleReaction(msg.id, emoji);
                                    setShowReactionPicker(null);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-scale-700 rounded-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* Поле ввода */}
      {!isVoice && (
        <div className="px-4 pb-4 pt-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-scale-700 rounded-lg flex items-center px-4 py-3 gap-3">
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Написать в #${channel.name}`}
                className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                autoComplete="off"
              />
              <div className="flex items-center gap-2 text-zinc-400">
                <button type="button" className="hover:text-zinc-200 transition-colors">
                  <Gift className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-zinc-200 transition-colors">
                  <Sticker className="w-5 h-5" />
                </button>
                <button type="button" className="hover:text-zinc-200 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
