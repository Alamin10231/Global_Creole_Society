"use client";

import { useState, useRef, useEffect } from "react";
import chatIcon from "../../assets/globalchat.png";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const GlobalChatPopUp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const popupRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ⭐ Connect to WebSocket
  useEffect(() => {
    socketRef.current = new WebSocket("ws://10.10.13.99:8001/ws/global-chat/");

    socketRef.current.onopen = () => {
      console.log("Connected to WS server");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("WS MESSAGE ->", data);

      if (data.type === "connection_established") {
        console.log("Handshake OK:", data.message);
        return;
      }

      if (data.type === "chat_message") {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            user: data.sender?.profile_name || "Unknown",
            avatar: data.sender?.profile_image || "/man-profile.jpg",
            message: data.content,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: false,
          },
        ]);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WS closed");
    };

    return () => socketRef.current.close();
  }, []);

  // ⭐ Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      type: "chat_message",
      content: message.trim(),
    };

    // Send to WebSocket backend
    socketRef.current.send(JSON.stringify(payload));

    // Add to UI
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        avatar: "/man-profile.jpg",
        message: message.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      },
    ]);

    setMessage("");
  };

  const handleInputFocus = () => setIsActive(true);
  const handleClose = () => {
    setIsOpen(false);
    setIsActive(false);
    setMessage("");
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setIsOpen(true)}>
          <img src={chatIcon} alt="" className="h-full w-full cursor-pointer" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setIsOpen(!isOpen)}>
          <img src={chatIcon} alt="Chat Icon" className="h-full w-full" />
        </button>
      </div>

      <div
        ref={popupRef}
        className="absolute bottom-30 right-10 w-[350px] h-[600px] xl:h-[700px] xl:w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out"
      >
        {!isActive ? (
          <div className="h-full bg-gradient-to-br from-[#1B3B66] via-[#0057FF] to-[#CAF4F7] flex flex-col justify-between p-6 text-white">
            <div>
              <ChatHeader onClose={handleClose} />
              <div className="text-start mt-10">
                <h2 className="text-3xl font-semibold mb-2 opacity-70">Join</h2>
                <p className="text-2xl leading-relaxed opacity-90 font-semibold">
                  Join the global chat to talk & connect in real time.
                </p>
              </div>
            </div>

            <ChatInput
              message={message}
              setMessage={setMessage}
              onFocus={handleInputFocus}
              onSend={handleSendMessage}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <ChatHeader onClose={handleClose} />
            <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

            <ChatInput
              message={message}
              setMessage={setMessage}
              onFocus={handleInputFocus}
              onSend={handleSendMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalChatPopUp;
