"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ServerSidebar } from "@/components/server/ServerSidebar";
import { ChannelSidebar } from "@/components/server/ChannelSidebar";
import { ChatArea } from "@/components/server/ChatArea";
import { MemberList } from "@/components/server/MemberList";
import { ToastContainer, type Toast } from "@/components/ui/Toast";
import { getSocket } from "@/lib/socket";

export type Channel = {
  id: string;
  name: string;
  type: "text" | "voice";
  topic?: string;
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

const servers: Server[] = [
  {
    id: "s1",
    name: "Главное Логово",
    initial: "🐉",
    color: "bg-wyvern-600",
    channels: [
      { id: "1", name: "добро-пожаловать", type: "text", topic: "Добро пожаловать в Главное Логово!" },
      { id: "2", name: "правила-логова", type: "text", topic: "Правила нашего логова" },
      { id: "3", name: "общий-чат", type: "text", topic: "Главный канал для общения драконов и наездников" },
      { id: "4", name: "мемы-и-огонь", type: "text", topic: "Мемы, скрины и огонь" },
      { id: "5", name: "голос-драконов", type: "voice" },
      { id: "6", name: "рейд-на-боссов", type: "voice" },
      { id: "7", name: "скриншоты", type: "text", topic: "Делимся красивыми моментами" },
      { id: "8", name: "идеи-для-wyvern", type: "text", topic: "Предложения по развитию Wyvern" },
    ],
  },
  {
    id: "s2",
    name: "Огненные Крылья",
    initial: "🔥",
    color: "bg-orange-600",
    channels: [
      { id: "c1", name: "общий", type: "text", topic: "Основной чат Огненных Крыльев" },
      { id: "c2", name: "тактика", type: "text", topic: "Обсуждение тактик" },
      { id: "c3", name: "голос", type: "voice" },
    ],
  },
  {
    id: "s3",
    name: "Чешуя и Код",
    initial: "⚔️",
    color: "bg-emerald-700",
    channels: [
      { id: "d1", name: "разработка", type: "text", topic: "Код и баги Wyvern" },
      { id: "d2", name: "дизайн", type: "text", topic: "UI/UX идеи" },
      { id: "d3", name: "голос-кодеров", type: "voice" },
    ],
  },
  {
    id: "s4",
    name: "Ночной Патруль",
    initial: "🌙",
    color: "bg-indigo-700",
    channels: [
      { id: "n1", name: "дозор", type: "text", topic: "Ночные разговоры" },
      { id: "n2", name: "истории", type: "text", topic: "Легенды и сказки" },
      { id: "n3", name: "тихий-голос", type: "voice" },
    ],
  },
];

const members: Member[] = [
  { name: "Добрый Дракон", avatar: "🐉", role: "Хранитель Пламени", roleColor: "text-wyvern-400", status: "Строит Wyvern", online: true },
  { name: "Огненная Чешуя", avatar: "🔥", role: "Крылатый Разведчик", roleColor: "text-orange-400", status: "В голосовом", online: true },
  { name: "Ночной Страж", avatar: "🌙", role: "Древний Мудрец", roleColor: "text-indigo-400", status: "Онлайн", online: true },
  { name: "Кодекс Чешуи", avatar: "📜", role: "Хранитель Знаний", roleColor: "text-emerald-400", status: "Пишет правила", online: true },
  { name: "Древний Мудрец", avatar: "🧙", role: "Древний Мудрец", roleColor: "text-purple-400", status: "", online: false },
  { name: "Крылатый Разведчик", avatar: "🦅", role: "Крылатый Разведчик", roleColor: "text-sky-400", status: "", online: false },
];

const initialMessages: Record<string, Message[]> = {
  "3": [
    {
      id: "1",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня в 12:05",
      content: "Приветствую всех в Главном Логове! Сегодня мы начинаем строить настоящий драконий Discord.",
      color: "text-wyvern-400",
      role: "Хранитель Пламени",
      isOwn: true,
      pinned: true,
      reactions: [
        { emoji: "🔥", count: 3, reacted: false },
        { emoji: "🐉", count: 2, reacted: true },
      ],
    },
    {
      id: "2",
      author: "Огненная Чешуя",
      avatar: "🔥",
      time: "Сегодня в 12:07",
      content: "Наконец-то! Я ждал этого момента. Интерфейс уже выглядит очень уютно.",
      color: "text-orange-400",
      role: "Крылатый Разведчик",
      reactions: [{ emoji: "❤️", count: 1, reacted: false }],
    },
    {
      id: "3",
      author: "Ночной Страж",
      avatar: "🌙",
      time: "Сегодня в 12:08",
      content: "Голосовые каналы будут с настоящим эхом пещер? 😏",
      color: "text-indigo-400",
      role: "Древний Мудрец",
    },
    {
      id: "4",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня в 12:10",
      content: "Обязательно. И роли с названиями вроде \"Хранитель Пламени\", \"Крылатый Разведчик\" и \"Древний Мудрец\".",
      color: "text-wyvern-400",
      role: "Хранитель Пламени",
      isOwn: true,
      reactions: [{ emoji: "✨", count: 4, reacted: false }],
      replyTo: {
        id: "3",
        author: "Ночной Страж",
        content: "Голосовые каналы будут с настоящим эхом пещер? 😏",
      },
    },
    {
      id: "5",
      author: "Кодекс Чешуи",
      avatar: "📜",
      time: "Сегодня в 12:12",
      content: "Предлагаю сразу сделать красивые системные сообщения, когда кто-то заходит в логово.",
      color: "text-emerald-400",
      role: "Хранитель Знаний",
    },
  ],
  "1": [
    {
      id: "w1",
      author: "Система",
      avatar: "✨",
      time: "Сегодня",
      content: "Добро пожаловать в Главное Логово Wyvern! Здесь собираются драконы и их наездники.",
      color: "text-zinc-400",
      pinned: true,
    },
  ],
  "8": [
    {
      id: "i1",
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сегодня",
      content: "Кидайте сюда любые идеи по развитию проекта. Я читаю всё.",
      color: "text-wyvern-400",
      role: "Хранитель Пламени",
      isOwn: true,
    },
  ],
  "c1": [
    {
      id: "f1",
      author: "Огненная Чешуя",
      avatar: "🔥",
      time: "Сегодня",
      content: "Крылья готовы к полёту! Кто со мной в рейд?",
      color: "text-orange-400",
      role: "Крылатый Разведчик",
      reactions: [{ emoji: "🔥", count: 5, reacted: false }],
    },
  ],
  "d1": [
    {
      id: "dev1",
      author: "Кодекс Чешуи",
      avatar: "📜",
      time: "Сегодня",
      content: "Сегодня добавили реакции и переключение серверов. Красота!",
      color: "text-emerald-400",
      role: "Хранитель Знаний",
      reactions: [{ emoji: "💻", count: 2, reacted: true }],
    },
  ],
};

export default function AppPage() {
  const [activeServerId, setActiveServerId] = useState("s1");
  const [activeChannelId, setActiveChannelId] = useState("3");
  const [messagesByChannel, setMessagesByChannel] = useState(initialMessages);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ReplyRef | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const activeChannelIdRef = useRef(activeChannelId);
  activeChannelIdRef.current = activeChannelId;

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const activeChannel =
    activeServer.channels.find((c) => c.id === activeChannelId) ||
    activeServer.channels[0];
  const messages = messagesByChannel[activeChannelId] || [];
  const pinnedMessages = messages.filter((m) => m.pinned);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Socket.io setup
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setSocketConnected(true);
      socket.emit("join-channel", activeChannelIdRef.current);
    };

    const onDisconnect = () => setSocketConnected(false);

    const onNewMessage = (message: Message) => {
      // Сообщения от других клиентов
      const msg = { ...message, isOwn: false };
      setMessagesByChannel((prev) => ({
        ...prev,
        [activeChannelIdRef.current]: [
          ...(prev[activeChannelIdRef.current] || []),
          msg,
        ],
      }));
    };

    const onReactionUpdated = (data: { messageId: string; reactions: Reaction[] }) => {
      setMessagesByChannel((prev) => {
        const channelMessages = prev[activeChannelIdRef.current] || [];
        return {
          ...prev,
          [activeChannelIdRef.current]: channelMessages.map((msg) =>
            msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
          ),
        };
      });
    };

    const onUserTyping = (data: { isTyping: boolean; user: string }) => {
      if (data.isTyping) {
        setRemoteTyping(data.user);
      } else {
        setRemoteTyping(null);
      }
    };

    const onMessageEdited = (data: { messageId: string; content: string }) => {
      setMessagesByChannel((prev) => {
        const channelMessages = prev[activeChannelIdRef.current] || [];
        return {
          ...prev,
          [activeChannelIdRef.current]: channelMessages.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, content: data.content, edited: true }
              : msg
          ),
        };
      });
    };

    const onMessageDeleted = (data: { messageId: string }) => {
      setMessagesByChannel((prev) => {
        const channelMessages = prev[activeChannelIdRef.current] || [];
        return {
          ...prev,
          [activeChannelIdRef.current]: channelMessages.filter(
            (msg) => msg.id !== data.messageId
          ),
        };
      });
    };

    const onPinUpdated = (data: { messageId: string; pinned: boolean }) => {
      setMessagesByChannel((prev) => {
        const channelMessages = prev[activeChannelIdRef.current] || [];
        return {
          ...prev,
          [activeChannelIdRef.current]: channelMessages.map((msg) =>
            msg.id === data.messageId ? { ...msg, pinned: data.pinned } : msg
          ),
        };
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-message", onNewMessage);
    socket.on("reaction-updated", onReactionUpdated);
    socket.on("user-typing", onUserTyping);
    socket.on("message-edited", onMessageEdited);
    socket.on("message-deleted", onMessageDeleted);
    socket.on("pin-updated", onPinUpdated);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-message", onNewMessage);
      socket.off("reaction-updated", onReactionUpdated);
      socket.off("user-typing", onUserTyping);
      socket.off("message-edited", onMessageEdited);
      socket.off("message-deleted", onMessageDeleted);
      socket.off("pin-updated", onPinUpdated);
    };
  }, []);

  // При смене канала — присоединяемся к новой комнате
  useEffect(() => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit("join-channel", activeChannelId);
    }
    setRemoteTyping(null);
  }, [activeChannelId]);

  const handleSelectServer = (serverId: string) => {
    if (serverId === activeServerId) return;
    const server = servers.find((s) => s.id === serverId);
    if (!server) return;

    setActiveServerId(serverId);
    const firstText = server.channels.find((c) => c.type === "text") || server.channels[0];
    setActiveChannelId(firstText.id);
    setReplyingTo(null);
    addToast(`Перешли в логово «${server.name}»`, "success");
  };

  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setIsTyping(false);
    setReplyingTo(null);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      author: "Добрый Дракон",
      avatar: "🐉",
      time: "Сейчас",
      content: content.trim(),
      color: "text-wyvern-400",
      role: "Хранитель Пламени",
      isOwn: true,
      reactions: [],
      replyTo: replyingTo || undefined,
    };

    // Локально добавляем
    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage],
    }));

    // Отправляем другим
    const socket = getSocket();
    socket.emit("send-message", {
      channelId: activeChannelId,
      message: { ...newMessage, isOwn: false }, // у других isOwn будет false
    });

    setIsTyping(false);
    setReplyingTo(null);
    addToast("Сообщение отправлено", "success");
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessagesByChannel((prev) => {
      const channelMessages = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: channelMessages.map((msg) =>
          msg.id === messageId && msg.isOwn
            ? { ...msg, content: newContent, edited: true }
            : msg
        ),
      };
    });

    const socket = getSocket();
    socket.emit("edit-message", {
      channelId: activeChannelId,
      messageId,
      content: newContent,
    });

    addToast("Сообщение изменено", "success");
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessagesByChannel((prev) => {
      const channelMessages = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: channelMessages.filter(
          (msg) => !(msg.id === messageId && msg.isOwn)
        ),
      };
    });

    const socket = getSocket();
    socket.emit("delete-message", {
      channelId: activeChannelId,
      messageId,
    });

    addToast("Сообщение удалено", "info");
  };

  const handleTogglePin = (messageId: string) => {
    let newPinned = false;

    setMessagesByChannel((prev) => {
      const channelMessages = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: channelMessages.map((msg) => {
          if (msg.id === messageId) {
            newPinned = !msg.pinned;
            return { ...msg, pinned: newPinned };
          }
          return msg;
        }),
      };
    });

    const socket = getSocket();
    socket.emit("toggle-pin", {
      channelId: activeChannelId,
      messageId,
      pinned: newPinned,
    });

    addToast(newPinned ? "Сообщение закреплено" : "Сообщение откреплено", newPinned ? "success" : "info");
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    let updatedReactions: Reaction[] = [];

    setMessagesByChannel((prev) => {
      const channelMessages = prev[activeChannelId] || [];
      const updated = channelMessages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = [...(msg.reactions || [])];
        const existing = reactions.find((r) => r.emoji === emoji);

        if (existing) {
          if (existing.reacted) {
            existing.count -= 1;
            existing.reacted = false;
            if (existing.count <= 0) {
              updatedReactions = reactions.filter((r) => r.emoji !== emoji);
              return { ...msg, reactions: updatedReactions };
            }
          } else {
            existing.count += 1;
            existing.reacted = true;
          }
        } else {
          reactions.push({ emoji, count: 1, reacted: true });
        }

        updatedReactions = reactions;
        return { ...msg, reactions };
      });

      return { ...prev, [activeChannelId]: updated };
    });

    const socket = getSocket();
    socket.emit("toggle-reaction", {
      channelId: activeChannelId,
      messageId,
      emoji,
      reactions: updatedReactions,
    });
  };

  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    const socket = getSocket();
    socket.emit("typing", {
      channelId: activeChannelId,
      isTyping: typing,
      user: "Добрый Дракон",
    });
  };

  const handleStartReply = (msg: Message) => {
    setReplyingTo({
      id: msg.id,
      author: msg.author,
      content: msg.content,
    });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

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
        onSelectChannel={handleSelectChannel}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <ChatArea
          channel={activeChannel}
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
          onStartReply={handleStartReply}
          onCancelReply={handleCancelReply}
          onTyping={handleTyping}
        />
      </div>

      <MemberList members={members} />

      <ToastContainer toasts={toasts} />
    </div>
  );
}
