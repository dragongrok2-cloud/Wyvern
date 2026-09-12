"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Ошибка регистрации");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
      } else {
        router.push("/app");
        router.refresh();
      }
    } catch {
      setError("Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-scale-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-wyvern-950/40 via-scale-900 to-scale-900" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-wyvern-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐉</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-wyvern-400 to-orange-400 bg-clip-text text-transparent">
            Wyvern
          </h1>
          <p className="text-zinc-400 mt-1">Войди в логово</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-scale-800/80 border border-zinc-700/50 rounded-2xl p-6 space-y-4 shadow-2xl"
        >
          {mode === "register" && (
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Имя дракона</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-scale-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-wyvern-500/50"
                placeholder="Добрый Дракон"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-scale-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-wyvern-500/50"
              placeholder="dragon@wyvern.app"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-scale-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-wyvern-500/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-wyvern-500 hover:bg-wyvern-600 text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-wyvern-500/20"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти в Логово" : "Создать аккаунт"}
          </button>

          <p className="text-center text-sm text-zinc-400">
            {mode === "login" ? (
              <>
                Нет аккаунта?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-wyvern-400 hover:underline"
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-wyvern-400 hover:underline"
                >
                  Войти
                </button>
              </>
            )}
          </p>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500 space-y-1">
          <p>Демо-аккаунты (пароль: <code className="text-zinc-400">dragon123</code>):</p>
          <p>dragon@wyvern.app · fire@wyvern.app · night@wyvern.app</p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← На главную
          </Link>
        </div>
      </div>
    </main>
  );
}
