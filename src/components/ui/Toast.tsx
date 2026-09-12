"use client";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "info" | "error";
};

type Props = {
  toasts: Toast[];
};

export function ToastContainer({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-5 fade-in duration-300 min-w-[240px] max-w-sm ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-100"
              : toast.type === "error"
              ? "bg-red-950/90 border-red-500/30 text-red-100"
              : "bg-scale-800/95 border-zinc-600/50 text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {toast.type === "success" ? "✨" : toast.type === "error" ? "💥" : "🐉"}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
