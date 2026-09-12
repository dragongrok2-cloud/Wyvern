import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wyvern — Драконий Discord",
  description: "Голос, чат и сообщество для наездников небес. Discord, который почти стал Wyvern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen bg-scale-900 text-white">
        {children}
      </body>
    </html>
  );
}
