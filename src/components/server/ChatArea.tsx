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
  MessageSquare,
} from "lucide-react";
import type { Channel, Message, ReplyRef } from "@/app/app/page";

type Props = {
  channel: Channel;
  messages: Message[];
  pinnedMessages: Message[];
  isTyping: boolean;
  typingUser?: string | null;
  replyingTo: ReplyRef | null;
  socketConnected?: boolean;
  onSendMessage: (content: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onTogglePin: (messageId: string) => void;
  onStartReply: (msg: Message) => void;
  onCancelReply: () => void;
  onTyping: (typing: boolean) => void;
  onCreateThread?: (msg: Message) => void;
  onOpenThread?: (threadId: string) => void;
};

const QUICK_EMOJIS = ["🔥", "🐉", "❤️", "✨", "😂", "👍"];

export function ChatArea({
  channel,
  messages,
  pinnedMessages,
  isTyping,
  typingUser,
  replyingTo,
  socketConnected = false,
  onSendMessage,
  onToggleReaction,
  onEditMessage,
  onDeleteMessage,
  onTogglePin,
  onStartReply,
  onCancelReply,
  onTyping,
  onCreateThread,
  onOpenThread,
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
    if (replyingTo) inputRef.current?.focus();
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
    if (editingId && editContent.trim()) onEditMessage(editingId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const isVoice = channel.type === "voice";
  const displayTypingName = typingUser || "Добрый Дракон";

  return (
    <div className="flex flex-col h-full bg-scale-800/40">
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
          <div
            className={`ml-2 w-2 h-2 rounded-full ${socketConnected ? "bg-emerald-400" : "bg-zinc-600"}`}
            title={socketConnected ? "Real-time подключён" : "Нет соединения"}
          />
        </div>
        <div className="flex items-center gap-3 text-zinc-400 flex-shrink-0">
          <button className="hover:text-zinc-200 transition-colors"><Bell className="w-5 h-5" /></button>
          <button
            onClick={() => setShowPins(!showPins)}
            className={`hover:text-zinc-200 transition-colors relative ${pinnedMessages.length > 0 ? "text-wyvern-400" : ""}`}
            title="Закреплённые"
          >
            <Pin className="w-5 h-5" />
            {pinnedMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-wyvern-500 text-[10px] rounded-full flex items-center justify-center text-white">
                {pinnedMessages.length}
              </span>
            )}
          </button>
          <button className="hover:text-zinc-200 transition-colors"><Users className="w-5 h-5" /></button>
        </div>
      </div>

      {showPins && pinnedMessages.length > 0 && (
        <div className="border-b border-zinc-800 bg-scale-900/80 px-4 py-3 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-wyvern-400 flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5" /> Закреплённые — {pinnedMessages.length}
            </span>
            <button onClick={() => setShowPins(false)} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          {pinnedMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2 p-2 rounded-lg bg-scale-800/60 border border-zinc-700/50 mb-1">
              <span className="text-sm">{msg.avatar}</span>
              <div className="min-w-0 flex-1">
                <span className={`text-sm font-medium ${msg.color}`}>{msg.author}</span>
                <p className="text-sm text-zinc-300 truncate">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!isVoice && (
          <>
            <div className="flex flex-col items-center justify-center py-6 text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-wyvern-600/20 flex items-center justify-center text-2xl mb-3">#</div>
              <h3 className="text-xl font-bold mb-1">#{channel.name}</h3>
              <p className="text-zinc-400 text-sm max-w-md">{channel.topic || "Канал логова Wyvern"}</p>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 hover:bg-scale-800/40 px-2 py-1.5 rounded group relative ${
                    msg.pinned ? "border-l-2 border-wyvern-500/60" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-scale-700 flex items-center justify-center text-lg flex-shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    {msg.replyTo && (
                      <div className="flex items-center gap-1.5 mb-0.5 text-xs text-zinc-400">
                        <Reply className="w-3 h-3" />
                        <span className="font-medium text-zinc-300">{msg.replyTo.author}</span>
                        <span className="truncate max-w-[180px]">{msg.replyTo.content}</span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className={`font-medium ${msg.color}`}>{msg.author}</span>
                      {msg.role && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-scale-700 text-zinc-400">{msg.role}</span>
                      )}
                      <span className="text-xs text-zinc-500">{msg.time}</span>
                      {msg.edited && <span className="text-[10px] text-zinc-500">(изм.)</span>}
                      {msg.pinned && (
                        <span className="text-[10px] text-wyvern-400 flex items-center gap-0.5">
                          <Pin className="w-3 h-3" /> закреплено
                        </span>
                      )}
                    </div>

                    {editingId === msg.id ? (
                      <div className="mt-1 flex gap-2">
                        <input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 bg-scale-900 border border-zinc-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-wyvern-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <button onClick={saveEdit} className="p-1.5 rounded bg-emerald-600 text-white"><Check className="w-4 h-4" /></button>
                        <button onClick={cancelEdit} className="p-1.5 rounded bg-scale-700"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <p className="text-zinc-200 leading-relaxed">{msg.content}</p>
                    )}

                    {/* Thread link */}
                    {msg.threadId && onOpenThread && (
                      <button
                        onClick={() => onOpenThread(msg.threadId!)}
                        className="mt-1 flex items-center gap-1.5 text-xs text-wyvern-400 hover:text-wyvern-300"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Поток{msg.threadCount !== undefined ? ` · ${msg.threadCount}` : ""}
                      </button>
                    )}

                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {msg.reactions?.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => onToggleReaction(msg.id, r.emoji)}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs ${
                            r.reacted
                              ? "bg-wyvern-500/20 border border-wyvern-500/40 text-wyvern-300"
                              : "bg-scale-700/80 hover:border-zinc-600 text-zinc-300"
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </button>
                      ))}

                      <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                        <button onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)} className="p-1 rounded hover:bg-scale-700 text-zinc-400">
                          <Smile className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onStartReply(msg)} className="p-1 rounded hover:bg-scale-700 text-zinc-400" title="Ответить">
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        {onCreateThread && !msg.threadId && (
                          <button onClick={() => onCreateThread(msg)} className="p-1 rounded hover:bg-scale-700 text-zinc-400" title="Создать поток">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => onTogglePin(msg.id)} className="p-1 rounded hover:bg-scale-700 text-zinc-400" title={msg.pinned ? "Открепить" : "Закрепить"}>
                          {msg.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                        </button>
                        {msg.isOwn && editingId !== msg.id && (
                          <>
                            <button onClick={() => startEdit(msg)} className="p-1 rounded hover:bg-scale-700 text-zinc-400"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => onDeleteMessage(msg.id)} className="p-1 rounded hover:bg-red-900/50 text-zinc-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                      </div>

                      {showReactionPicker === msg.id && (
                        <div className="flex gap-1 p-1.5 bg-scale-800 border border-zinc-700 rounded-xl shadow-xl">
                          {QUICK_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                onToggleReaction(msg.id, emoji);
                                setShowReactionPicker(null);
                              }}
                              className="w-7 h-7 flex items-center justify-center text-base hover:bg-scale-700 rounded-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-400">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-wyvern-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>{displayTypingName} печатает...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      {!isVoice && (
        <div className="px-4 pb-4 pt-2">
          {replyingTo && (
            <div className="flex items-center justify-between bg-scale-800 border border-zinc-700 rounded-t-lg px-3 py-2 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Reply className="w-4 h-4 text-wyvern-400 flex-shrink-0" />
                <span className="text-zinc-400">Ответ</span>
                <span className="font-medium text-wyvern-300 truncate">{replyingTo.author}</span>
              </div>
              <button onClick={onCancelReply} className="p-1 hover:bg-scale-700 rounded"><X className="w-4 h-4" /></button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={`bg-scale-700 flex items-center px-4 py-3 gap-3 ${replyingTo ? "rounded-b-lg" : "rounded-lg"}`}>
              <PlusCircle className="w-6 h-6 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={replyingTo ? `Ответить ${replyingTo.author}...` : `Написать в #${channel.name}`}
                className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
