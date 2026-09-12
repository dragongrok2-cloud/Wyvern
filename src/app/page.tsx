import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-wyvern-950/40 via-scale-900 to-scale-900" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-wyvern-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div className="mb-6 text-7xl">🐉</div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-wyvern-400 via-wyvern-500 to-orange-400 bg-clip-text text-transparent">
            Wyvern
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-300 mb-3 font-medium">
          Драконий аналог Discord
        </p>

        <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
          Discord почти назвали именно так.  
          Мы решили довести дело до конца — с огнём, чешуёй и настоящим логом для друзей.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-wyvern-500 hover:bg-wyvern-600 text-white font-semibold transition-all shadow-lg shadow-wyvern-500/25 hover:shadow-wyvern-500/40"
          >
            Войти в Логово
          </Link>
          <Link
            href="/app"
            className="px-8 py-3.5 rounded-xl bg-scale-800 hover:bg-scale-700 border border-zinc-700 text-zinc-200 font-medium transition-all"
          >
            Попробовать без входа
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <Feature
            emoji="🔥"
            title="Голос с огнём"
            description="Настоящие голосовые каналы на LiveKit с низкой задержкой"
          />
          <Feature
            emoji="🏰"
            title="Логова"
            description="Серверы с ролями, каналами, потоками и атмосферой клана"
          />
          <Feature
            emoji="✨"
            title="Real-time"
            description="Socket.io + база данных + авторизация из коробки"
          />
        </div>
      </div>

      <footer className="absolute bottom-6 text-zinc-500 text-sm">
        Сделано с огнём вашим добрым драконом 🐉
      </footer>
    </main>
  );
}

function Feature({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-scale-800/50 border border-zinc-800 hover:border-wyvern-500/30 transition-colors">
      <div className="text-2xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
