# 🐉 Wyvern

**Настоящий драконий аналог Discord**

> Discord почти назвали Wyvern.  
> Мы решили не упускать эту возможность.

---

## ✨ Что уже есть

| Функция | Статус |
|---------|--------|
| UI логова / каналов / чата | ✅ |
| Real-time (Socket.io) | ✅ |
| Реакции, ответы, пины | ✅ |
| Редактирование / удаление | ✅ |
| Роли с цветами | ✅ |
| **База данных (Prisma + SQLite)** | ✅ |
| **Авторизация (NextAuth)** | ✅ |
| **Голосовые каналы (LiveKit)** | ✅ каркас |
| Потоки (Threads) | 🟡 схема готова |

---

## 🚀 Быстрый старт

```bash
git clone https://github.com/dragongrok2-cloud/Wyvern.git
cd Wyvern
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Открой http://localhost:3000

### Демо-аккаунты

| Email | Пароль | Имя |
|-------|--------|-----|
| dragon@wyvern.app | dragon123 | Добрый Дракон |
| fire@wyvern.app | dragon123 | Огненная Чешуя |
| night@wyvern.app | dragon123 | Ночной Страж |
| code@wyvern.app | dragon123 | Кодекс Чешуи |

---

## 🗄 База данных

Используется **Prisma + SQLite** (файл `prisma/dev.db`).

```bash
npx prisma db push     # применить схему
npm run db:seed        # заполнить демо-данными
npm run db:studio      # открыть GUI
```

Модели: User, Server, Channel, Message, Thread, Reaction, ServerMember.

Для продакшена замени `DATABASE_URL` на PostgreSQL.

---

## 🔐 Авторизация

- NextAuth.js (Credentials)
- Регистрация: `/login` → «Зарегистрироваться»
- Сессии через JWT
- После логина → `/app`

---

## 🎤 Голосовые каналы (LiveKit)

1. Создай бесплатный проект на [cloud.livekit.io](https://cloud.livekit.io)
2. Добавь в `.env`:

```env
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

3. Зайди в любой голосовой канал и нажми **«Присоединиться к голосу»**

Компонент: `src/components/server/VoiceChannel.tsx`

---

## 🧵 Потоки (Threads)

Схема Prisma уже поддерживает Thread + связь Message ↔ Thread.  
UI потоков — следующий шаг (кнопка «Создать ветку» на сообщении).

---

## 📁 Структура

```
server.ts                 — Next.js + Socket.io
prisma/schema.prisma      — полная схема БД
prisma/seed.ts            — демо-данные
src/
  app/
    login/                — вход / регистрация
    api/auth/             — NextAuth + register
    api/livekit/token/    — токены для голоса
  components/server/      — UI логова
  lib/
    prisma.ts
    auth.ts
    socket.ts
```

---

*Сделано с огнём вашим добрым драконом* 🐉🔥
