"use client";

import { useState, useRef, useEffect } from "react";
import { FaPhone, FaVideo, FaEllipsisV, FaPaperPlane } from "react-icons/fa";
import Message from "./Message";
import { useNavigate } from "react-router-dom";

function ChatWindow({ chat, messages }) {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const [socket, setSocket] = useState(null);

  // THIS replaces your old "messages"
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Load API messages when chat changes
  useEffect(() => {
    if (messages?.length) {
      const formatted = messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender_name: msg.sender.profile_name,
        sender_image: msg.sender.profile_image,
        isOwn: msg.sender.id == currentUserId,
        createdAt: msg.created_at,
      }));

      setChatMessages(formatted);
    } else {
      setChatMessages([]);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // WebSocket Connection
  useEffect(() => {
    if (!chat?.id) return;
    const ws = new WebSocket(
      `ws://10.10.13.99:8001/ws/chat/${chat.id}/?token=${token}`
    );

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = (err) => console.log("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat_message") {
        const newMessage = {
          id: data.id || Date.now(),
          content: data.content,
          sender_name: data.sender_name,
          sender_image: data.sender_image,
          isOwn: data.sender_id == currentUserId,
          createdAt: new Date().toISOString(),
        };

        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    return () => ws.close();
  }, [chat]);

  // Send Message
const handleSend = (e) => {
  e.preventDefault();
  if (!socket || !messageText.trim()) return;

  socket.send(
    JSON.stringify({
      type: "chat_message",
      content: messageText,
    })
  );

  // remove optimistic update
  setMessageText("");
};


  const [messageText, setMessageText] = useState("");

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );

  const user = chat.other_participant;

  return (
    <div className="flex-1 flex flex-col ">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3 ">
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

        <div className="flex items-center gap-2 ">
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
      <div className="flex flex-col overflow-y-auto p-4 space-y-4 justify-center ">
        {chatMessages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div className="" ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2  ">
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
