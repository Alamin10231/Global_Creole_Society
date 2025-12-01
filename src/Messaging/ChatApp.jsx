import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import Navbar from "../Components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getchatlist, getMessages } from "../API/api";

function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(null);

  // Fetch chat list
  const { data: chats, isLoading: isChatLoading } = useQuery({
    queryKey: ["chatList"],
    queryFn: getchatlist,
  });

  // Fetch messages when chat is selected
  const { data: messages, isLoading: isMsgLoading } = useQuery({
    queryKey: ["messages", selectedChat?.id],
    queryFn: () => getMessages(selectedChat.id),
    enabled: !!selectedChat?.id,
  });

  const [filter, setFilter] = useState("all");

  if (isChatLoading) return <p className="p-10">Loading chats...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-7">
        <Navbar />
      </div>

      <div className="flex h-[calc(100vh-160px)]">
        <ChatSidebar
          chats={chats ?? []}
          selectedChat={selectedChat}
          onChatSelect={setSelectedChat}
          filter={filter}
          onFilterChange={setFilter}
        />

        <ChatWindow
          chat={selectedChat}
          messages={messages?.results ?? []}  // ⭐ FIXED!
          isLoading={isMsgLoading}
        />
      </div>
    </div>
  );
}

export default ChatApp;
