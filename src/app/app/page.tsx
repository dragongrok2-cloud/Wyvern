"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { ServerSidebar } from "@/components/server/ServerSidebar";
import { ChannelSidebar } from "@/components/server/ChannelSidebar";
import { ChatArea } from "@/components/server/ChatArea";
import { MemberList } from "@/components/server/MemberList";
import { ThreadPanel } from "@/components/server/ThreadPanel";
import { ToastContainer, type Toast } from "@/components/ui/Toast";
import { getSocket } from "@/lib/socket";
import { VoiceChannel } from "@/components/server/VoiceChannel";

export type Channel = {
  id: string;
  name: string;
  type: string;
  topic?: string | null;
};

export type Reaction = {
  emoji: string;
  count: number;
  reacted: boolean;
};

export type ReplyRef = {
  id: string;
  author: string;
  content: string;
};

export type Message = {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  color: string;
  role?: string;
  reactions?: Reaction[];
  isOwn?: boolean;
  edited?: boolean;
  pinned?: boolean;
  replyTo?: ReplyRef;
  threadId?: string | null;
  threadCount?: number;
};

export type Server = {
  id: string;
  name: string;
  initial: string;
  color: string;
  channels: Channel[];
};

export type Member = {
  name: string;
  avatar: string;
  role: string;
  roleColor: string;
  status: string;
  online: boolean;
};

function mapDbMessage(m: any, currentUserId?: string): Message {
  const reactionMap = new Map<string, { count: number; reacted: boolean }>();
  for (const r of m.reactions || []) {
    const existing = reactionMap.get(r.emoji) || { count: 0, reacted: false };
    existing.count += 1;
    if (currentUserId && (r.userId === currentUserId || r.user?.id === currentUserId)) {
      existing.reacted = true;
    }
    reactionMap.set(r.emoji, existing);
  }

  return {
    id: m.id,
    author: m.author?.name || "Unknown",
    avatar: m.author?.image || "🐉",
    time: new Date(m.createdAt).toLocaleString("ru", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }),
    content: m.content,
    color: m.author?.roleColor || "text-zinc-300",
    role: m.author?.role,
    isOwn: currentUserId
      ? m.authorId === currentUserId || m.author?.id === currentUserId
      : false,
    edited: m.edited,
    pinned: m.pinned,
    reactions: Array.from(reactionMap.entries()).map(([emoji, v]) => ({
      emoji,
      count: v.count,
      reacted: v.reacted,
    })),
    replyTo: m.replyTo
      ? {
          id: m.replyTo.id,
          author: m.replyTo.author?.name || "Unknown",
          content: m.replyTo.content,
        }
      : undefined,
    threadId: m.startedThread?.id || m.threadId,
    threadCount: m.startedThread?._count?.messages,
  };
}

export default function AppPage() {
  const { data: session, status } = useSession();
  const currentUserId = (session?.user as any)?.id;
  const currentUserName = session?.user?.name || "Дракон";

  const [servers, setServers] = useState<Server[]>([]);
  const [activeServerId, setActiveServerId] = useState("");
  const [activeChannelId, setActiveChannelId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReplyRef | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activeChannelIdRef = useRef(activeChannelId);
  activeChannelIdRef.current = activeChannelId;

  const activeServer = servers.find((s) => s.id === activeServerId);
  const activeChannel = activeServer?.channels.find((c) => c.id === activeChannelId);
  const pinnedMessages = messages.filter((m) => m.pinned);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/servers");
        if (res.ok) {
          const data = await res.json();
          const mapped: Server[] = data.map((s: any) => ({
            id: s.id,
            name: s.name,
            initial: s.icon,
            color: s.color,
            channels: s.channels.map((c: any) => ({
              id: c.id,
              name: c.name,
              type: c.type,
              topic: c.topic,
            })),
          }));
          setServers(mapped);
          if (mapped.length > 0) {
            setActiveServerId(mapped[0].id);
            const firstText =
              mapped[0].channels.find((c) => c.type === "text") || mapped[0].channels[0];
            if (firstText) setActiveChannelId(firstText.id);
          }
        }
      } catch (e) {
        console.error(e);
        addToast("Не удалось загрузить серверы", "error");
      } finally {
        setLoading(false);
      }
    }
    if (status !== "loading") load();
  }, [status, addToast]);

  useEffect(() => {
    if (!activeChannelId) return;
    async function loadMessages() {
      try {
        const res = await fetch(`/api/channels/${activeChannelId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.map((m: any) => mapDbMessage(m, currentUserId)));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadMessages();
    setActiveThreadId(null);
    setReplyingTo(null);
  }, [activeChannelId, currentUserId]);

  useEffect(() => {
    const socket = getSocket();
    const onConnect = () => {
      setSocketConnected(true);
      if (activeChannelIdRef.current) socket.emit("join-channel", activeChannelIdRef.current);
    };
    const onDisconnect = () => setSocketConnected(false);
    const onNewMessage = (raw: any) => {
      const msg = mapDbMessage(raw, currentUserId);
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    };
    const onUserTyping = (data: { isTyping: boolean; user: string }) => {
      setRemoteTyping(data.isTyping ? data.user : null);
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-message", onNewMessage);
    socket.on("user-typing", onUserTyping);
    if (socket.connected) onConnect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-message", onNewMessage);
      socket.off("user-typing", onUserTyping);
    };
  }, [currentUserId]);

  useEffect(() => {
    const socket = getSocket();
    if (socket.connected && activeChannelId) socket.emit("join-channel", activeChannelId);
    setRemoteTyping(null);
  }, [activeChannelId]);

  const handleSelectServer = (serverId: string) => {
    if (serverId === activeServerId) return;
    const server = servers.find((s) => s.id === serverId);
    if (!server) return;
    setActiveServerId(serverId);
    const firstText = server.channels.find((c) => c.type === "text") || server.channels[0];
    if (firstText) setActiveChannelId(firstText.id);
    addToast(`Перешли в логово «${server.name}»`, "success");
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChannelId) return;
    try {
      const res = await fetch(`/api/channels/${activeChannelId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), replyToId: replyingTo?.id }),
      });
      if (res.ok) {
        const data = await res.json();
        const msg = mapDbMessage(data, currentUserId);
        setMessages((prev) => [...prev, msg]);
        getSocket().emit("send-message", { channelId: activeChannelId, message: data });
        setReplyingTo(null);
        addToast("Сообщение отправлено", "success");
      } else {
        addToast("Не удалось отправить", "error");
      }
    } catch {
      addToast("Ошибка сети", "error");
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, content: newContent, edited: true } : m))
        );
        addToast("Сообщение изменено", "success");
      }
    } catch {
      addToast("Ошибка", "error");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        addToast("Сообщение удалено", "info");
      }
    } catch {
      addToast("Ошибка", "error");
    }
  };

  const handleTogglePin = async (messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;
    const newPinned = !msg.pinned;
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: newPinned }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, pinned: newPinned } : m))
        );
        addToast(newPinned ? "Закреплено" : "Откреплено", newPinned ? "success" : "info");
      }
    } catch {
      addToast("Ошибка", "error");
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const reactions = [...(msg.reactions || [])];
        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          if (existing.reacted) {
            existing.count -= 1;
            existing.reacted = false;
            if (existing.count <= 0)
              return { ...msg, reactions: reactions.filter((r) => r.emoji !== emoji) };
          } else {
            existing.count += 1;
            existing.reacted = true;
          }
        } else {
          reactions.push({ emoji, count: 1, reacted: true });
        }
        return { ...msg, reactions };
      })
    );
  };

  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    getSocket().emit("typing", {
      channelId: activeChannelId,
      isTyping: typing,
      user: currentUserName,
    });
  };

  const handleCreateThread = async (msg: Message) => {
    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msg.id }),
      });
      if (res.ok) {
        const thread = await res.json();
        setActiveThreadId(thread.id);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id ? { ...m, threadId: thread.id, threadCount: 0 } : m
          )
        );
        addToast("Поток создан", "success");
      }
    } catch {
      addToast("Не удалось создать поток", "error");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-scale-900 text-zinc-400">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🐉</div>
          <p>Пробуждаем логово...</p>
        </div>
      </div>
    );
  }

  if (!activeServer || !activeChannel) {
    return (
      <div className="flex h-screen items-center justify-center bg-scale-900 text-zinc-400">
        <div className="text-center">
          <p className="mb-4">Нет доступных логов. Запусти seed?</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-wyvern-400 hover:underline"
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  const isVoice = activeChannel.type === "voice";

  return (
    <div className="flex h-screen overflow-hidden bg-scale-900 text-zinc-100 relative">
      <ServerSidebar
        servers={servers}
        activeServerId={activeServerId}
        onSelectServer={handleSelectServer}
      />

      <ChannelSidebar
        serverName={activeServer.name}
        channels={activeServer.channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
        userName={currentUserName}
      />

      <div className="flex flex-1 flex-col min-w-0">
        {isVoice ? (
          <VoiceChannel
            channelName={activeChannel.name}
            channelId={activeChannel.id}
            userName={currentUserName}
          />
        ) : (
          <ChatArea
            channel={activeChannel as any}
            messages={messages}
            pinnedMessages={pinnedMessages}
            isTyping={isTyping || !!remoteTyping}
            typingUser={remoteTyping}
            replyingTo={replyingTo}
            socketConnected={socketConnected}
            onSendMessage={handleSendMessage}
            onToggleReaction={handleToggleReaction}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onTogglePin={handleTogglePin}
            onStartReply={(msg) =>
              setReplyingTo({ id: msg.id, author: msg.author, content: msg.content })
            }
            onCancelReply={() => setReplyingTo(null)}
            onTyping={handleTyping}
            onCreateThread={handleCreateThread}
            onOpenThread={(id) => setActiveThreadId(id)}
          />
        )}
      </div>

      {activeThreadId ? (
        <ThreadPanel
          threadId={activeThreadId}
          channelId={activeChannelId}
          onClose={() => setActiveThreadId(null)}
          currentUserId={currentUserId}
        />
      ) : (
        <MemberList
          members={[
            {
              name: currentUserName,
              avatar: "🐉",
              role: "Хранитель Пламени",
              roleColor: "text-wyvern-400",
              status: "В сети",
              online: true,
            },
          ]}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
