import { ServerSidebar } from "@/components/server/ServerSidebar";
import { ChannelSidebar } from "@/components/server/ChannelSidebar";
import { ChatArea } from "@/components/server/ChatArea";
import { MemberList } from "@/components/server/MemberList";

export default function AppPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-scale-900 text-zinc-100">
      {/* Левая полоска серверов */}
      <ServerSidebar />

      {/* Каналы текущего логова */}
      <ChannelSidebar />

      {/* Основная область чата */}
      <div className="flex flex-1 flex-col min-w-0">
        <ChatArea />
      </div>

      {/* Список участников */}
      <MemberList />
    </div>
  );
}
