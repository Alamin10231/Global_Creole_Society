import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import Navbar from "../Components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getchatlist, getMessages } from "../API/api";

function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(null);

  // ⬅️ Fetch all chat list
  const { data: chats, isLoading: isChatLoading } = useQuery({
    queryKey: ["chatList"],
    queryFn: getchatlist,
  });

  // ⬅️ Fetch messages when a chat is selected
  // const { data: messages, isLoading: isMsgLoading } = useQuery({
  //   queryKey: ["messages", selectedChat?.id],
  //   queryFn: () => getMessages(selectedChat.id),
  //   enabled: !!selectedChat, // run only when chat selected
  // });
  const {data:messages, isLoading:isMsgLoading} = useQuery({
    queryKey: ["messages", selectedChat?.id],
    queryFn:()=>getMessages(selectedChat.id)
  })

  const [filter, setFilter] = useState("all"); 

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleSendMessage = (messageText) => {
    console.log("Sending:", messageText);
  };

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
          onChatSelect={handleChatSelect}
          filter={filter}
          onFilterChange={handleFilterChange}
        />

        <ChatWindow
          chat={selectedChat}
          messages={messages ?? []}
          isLoading={isMsgLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default ChatApp;
