"use client";

import { useState, useRef, useEffect } from "react";
import { FaPhone, FaVideo, FaEllipsisV, FaPaperPlane } from "react-icons/fa";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../API/api";

function ChatWindow({ chat }) {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const [socket, setSocket] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Load messages from API
  const { data: apiMessages = [] } = useQuery({
    queryKey: ["messages", chat?.id],
    queryFn: () => getMessages(chat.id),
    enabled: !!chat?.id,
  });

  // Sync API → UI
  useEffect(() => {
    if (apiMessages.length > 0) {
      const formatted = apiMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender_name: msg.sender.profile_name,
        sender_image: msg.sender.profile_image,
        isOwn: msg.sender.id == currentUserId,
        createdAt: msg.created_at,
      }));
      setMessages(formatted);
    }
  }, [apiMessages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!chat?.id) return;

    const ws = new WebSocket(
      `wss://mahamudh474.pythonanywhere.com/ws/chat/${chat.id}/`
    );

    ws.onopen = () => console.log("WebSocket connected");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat_message") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: data.message,
            sender_name: data.sender_name,
            sender_image: data.sender_image,
            isOwn: data.sender_id == currentUserId,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [chat]);

  // Send message
  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !socket) return;

    socket.send(
      JSON.stringify({
        type: "chat_message",
        message: messageText,
      })
    );

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: messageText,
        sender_name: "You",
        isOwn: true,
        createdAt: new Date().toISOString(),
      },
    ]);

    setMessageText("");
  };

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );

  const user = chat.other_participant;


  console.log("chat",chat);
  console.log("mahfux vai ",user); // Correct user reference

  return (
    <div className="flex-1 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src={user?.profile_image || "/placeholder.svg"}
            alt={user?.profile_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{user?.profile_name}</h3>
            <p className="text-xs text-green-500">Active</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/chat/audiocall")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaPhone />
          </button>
          <button
            onClick={() => navigate("/chat/videocall")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaVideo />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
