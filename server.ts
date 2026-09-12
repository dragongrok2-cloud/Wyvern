import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Хранилище в памяти (для демо)
  // В реальном проекте — Redis / PostgreSQL
  const rooms = new Map<string, Set<string>>(); // channelId -> Set of socket ids

  io.on("connection", (socket) => {
    console.log(`🐉 Client connected: ${socket.id}`);

    // Присоединение к каналу (комнате)
    socket.on("join-channel", (channelId: string) => {
      // Покидаем предыдущие комнаты
      for (const [room, sockets] of rooms.entries()) {
        if (sockets.has(socket.id)) {
          socket.leave(room);
          sockets.delete(socket.id);
        }
      }

      socket.join(channelId);
      if (!rooms.has(channelId)) {
        rooms.set(channelId, new Set());
      }
      rooms.get(channelId)!.add(socket.id);

      console.log(`🐉 ${socket.id} joined channel ${channelId}`);
    });

    // Новое сообщение
    socket.on("send-message", (data) => {
      // data: { channelId, message }
      socket.to(data.channelId).emit("new-message", data.message);
    });

    // Реакция
    socket.on("toggle-reaction", (data) => {
      // data: { channelId, messageId, emoji, reactions }
      socket.to(data.channelId).emit("reaction-updated", {
        messageId: data.messageId,
        reactions: data.reactions,
      });
    });

    // Печатает
    socket.on("typing", (data) => {
      // data: { channelId, isTyping, user }
      socket.to(data.channelId).emit("user-typing", {
        isTyping: data.isTyping,
        user: data.user,
      });
    });

    // Редактирование
    socket.on("edit-message", (data) => {
      socket.to(data.channelId).emit("message-edited", {
        messageId: data.messageId,
        content: data.content,
      });
    });

    // Удаление
    socket.on("delete-message", (data) => {
      socket.to(data.channelId).emit("message-deleted", {
        messageId: data.messageId,
      });
    });

    // Закрепление
    socket.on("toggle-pin", (data) => {
      socket.to(data.channelId).emit("pin-updated", {
        messageId: data.messageId,
        pinned: data.pinned,
      });
    });

    socket.on("disconnect", () => {
      console.log(`🐉 Client disconnected: ${socket.id}`);
      for (const [room, sockets] of rooms.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
        }
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`\n🐉 Wyvern is ready on http://${hostname}:${port}`);
      console.log(`   Real-time Socket.io is active\n`);
    });
});
