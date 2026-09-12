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
  Pencil,
  Trash2,
  Check,
  X,
  Reply,
  PinOff,
} from "lucide-react";
import type { Channel, Message, ReplyRef } from "@/app/app/page";

type Props = {
  channel: Channel;
  messages: Message[];
  pinnedMessages: Message[];
  isTyping: boolean;
  replyingTo: ReplyRef | null;
  onSendMessage: (content: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onTogglePin: (messageId: string) => void;
  onStartReply: (msg: Message) => void;
  onCancelReply: () => void;
  onTyping: (typing: boolean) => void;
};

const QUICK_EMOJIS = ["🔥", "🐉", "❤️", "✨", "😂", "👍"];

export function ChatArea({
  channel,
  messages,
  pinnedMessages,
  isTyping,
  replyingTo,
  onSendMessage,
  onToggleReaction,
  onEditMessage,
  onDeleteMessage,
  onTogglePin,
  onStartReply,
  onCancelReply,
  onTyping,
}: Props) {
  const [input, setInput] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showPins, setShowPins] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
    } else {
      onTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
    onTyping(false);
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      onEditMessage(editingId, editContent.trim());
    }
    setEditingId(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
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
              <span className="text-sm text-zinc-400 truncate hidden sm:inline">{channel.topic}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-zinc-400 flex-shrink-0">
          <button className="hover:text-zinc-200 transition-colors"><Bell className="w-5 h-5" /></button>
          <button
            onClick={() => setShowPins(!showPins)}
            className={`hover:text-zinc-200 transition-colors relative ${
              pinnedMessages.length > 0 ? "text-wyvern-400" : ""
            }`}
            title="Закреплённые сообщения"
          >
            <Pin className="w-5 h-5" />
            {pinnedMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-wyvern-500 text-[10px] rounded-full flex items-center justify-center text-white">
                {pinnedMessages.length}
              </span>
            )}
          </button>
          <button className="hover:text-zinc-200 transition-colors"><Users className="w-5 h-5" /></button>
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Поиск"
              className="w-36 bg-scale-900 text-sm rounded px-8 py-1 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-wyvern-500/50"
            />
          </div>
          <button className="hover:text-zinc-200 transition-colors"><Inbox className="w-5 h-5" /></button>
          <button className="hover:text-zinc-200 transition-colors"><HelpCircle className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Pinned messages panel */}
      {showPins && pinnedMessages.length > 0 && (
        <div className="border-b border-zinc-800 bg-scale-900/80 px-4 py-3 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-wyvern-400 flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5" />
              Закреплённые — {pinnedMessages.length}
            </span>
            <button onClick={() => setShowPins(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {pinnedMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 p-2 rounded-lg bg-scale-800/60 border border-zinc-700/50">
                <div className="text-lg">{msg.avatar}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${msg.color}`}>{msg.author}</span>
                    <span className="text-xs text-zinc-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-zinc-300 truncate">{msg.content}</p>
                </div>
                <button
                  onClick={() => onTogglePin(msg.id)}
                  className="p-1 text-zinc-500 hover:text-wyvern-400"
                  title="Открепить"
                >
                  <PinOff className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isVoice ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
            <Volume2 className="w-16 h-16 mb-4 opacity-40" />
            <h3 className="text-xl font-semibold text-zinc-200 mb-2">{channel.name}</h3>
            <p className="text-sm max-w-sm">Голосовой канал. Скоро здесь будет настоящий звук драконов.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8 text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-wyvern-600/20 flex items-center justify-center text-3xl mb-4">#</div>
              <h3 className="text-2xl font-bold mb-1">Добро пожаловать в #{channel.name}!</h3>
              <p className="text-zinc-400 text-sm max-w-md">
                {channel.topic || "Это начало истории канала. Здесь драконы собираются, чтобы рычать и строить будущее Wyvern."}
              </p>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 hover:bg-scale-800/40 px-2 py-1.5 rounded group relative ${
                    msg.pinned ? "border-l-2 border-wyvern-500/60" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-scale-700 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                    {msg.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Reply quote */}
                    {msg.replyTo && (
                      <div className="flex items-center gap-1.5 mb-1 text-xs text-zinc-400">
                        <Reply className="w-3 h-3" />
                        <span className="font-medium text-zinc-300">{msg.replyTo.author}</span>
                        <span className="truncate max-w-[200px]">{msg.replyTo.content}</span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`font-medium ${msg.color}`}>{msg.author}</span>
                      {msg.role && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-scale-700 text-zinc-400">
                          {msg.role}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">{msg.time}</span>
                      {msg.edited && <span className="text-[10px] text-zinc-500">(изменено)</span>}
                      {msg.pinned && (
                        <span className="text-[10px] text-wyvern-400 flex items-center gap-0.5">
                          <Pin className="w-3 h-3" /> закреплено
                        </span>
                      )}
                    </div>

                    {editingId === msg.id ? (
                      <div className="mt-1 flex gap-2 items-start">
                        <input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 bg-scale-900 border border-zinc-600 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-wyvern-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <button onClick={saveEdit} className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 rounded bg-scale-700 hover:bg-scale-600 text-zinc-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-zinc-200 leading-relaxed">{msg.content}</p>
                    )}

                    {/* Reactions + actions */}
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

                      <div className="relative">
                        <button
                          onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
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

                      {/* Actions */}
                      <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 ml-1 transition-opacity">
                        <button
                          onClick={() => onStartReply(msg)}
                          className="p-1 rounded hover:bg-scale-700 text-zinc-400 hover:text-zinc-200"
                          title="Ответить"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onTogglePin(msg.id)}
                          className="p-1 rounded hover:bg-scale-700 text-zinc-400 hover:text-wyvern-400"
                          title={msg.pinned ? "Открепить" : "Закрепить"}
                        >
                          {msg.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                        </button>
                        {msg.isOwn && editingId !== msg.id && (
                          <>
                            <button
                              onClick={() => startEdit(msg)}
                              className="p-1 rounded hover:bg-scale-700 text-zinc-400 hover:text-zinc-200"
                              title="Редактировать"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteMessage(msg.id)}
                              className="p-1 rounded hover:bg-red-900/50 text-zinc-400 hover:text-red-400"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-400">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>Добрый Дракон печатает...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {/* Reply bar + input */}
      {!isVoice && (
        <div className="px-4 pb-4 pt-2">
          {replyingTo && (
            <div className="flex items-center justify-between bg-scale-800 border border-zinc-700 rounded-t-lg px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Reply className="w-4 h-4 text-wyvern-400 flex-shrink-0" />
                <span className="text-zinc-400">Ответ для</span>
                <span className="font-medium text-wyvern-300 truncate">{replyingTo.author}</span>
                <span className="text-zinc-500 truncate max-w-[180px]">{replyingTo.content}</span>
              </div>
              <button onClick={onCancelReply} className="p-1 hover:bg-scale-700 rounded text-zinc-400 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={`bg-scale-700 flex items-center px-4 py-3 gap-3 ${
              replyingTo ? "rounded-b-lg" : "rounded-lg"
            }`}>
              <button type="button" className="text-zinc-400 hover:text-zinc-200 transition-colors">
                <PlusCircle className="w-6 h-6" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Ответить ${replyingTo.author}...`
                    : `Написать в #${channel.name}`
                }
                className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                autoComplete="off"
              />
              <div className="flex items-center gap-2 text-zinc-400">
                <button type="button" className="hover:text-zinc-200 transition-colors"><Gift className="w-5 h-5" /></button>
                <button type="button" className="hover:text-zinc-200 transition-colors"><Sticker className="w-5 h-5" /></button>
                <button type="button" className="hover:text-zinc-200 transition-colors"><Smile className="w-5 h-5" /></button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
