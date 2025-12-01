import React from "react";

const Message = ({ message }) => {
  const isOwn = message.isOwn;

  const timeString = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`w-full mb-4 flex ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* LEFT SIDE (Others) */}
      {!isOwn && (
        <img
          src={message.sender_image || "/placeholder.svg"}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
        />
      )}

      {/* BUBBLE */}
      <div
        className={`max-w-[70%] p-3 rounded-2xl shadow 
          ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
          }
        `}
      >
        {/* Name (only for others) */}
        {!isOwn && (
          <p className="text-xs font-medium text-gray-500 mb-1">
            {message.sender_name}
          </p>
        )}

        {/* TEXT */}
        {message.content && (
          <p className="text-sm whitespace-pre-line break-words">
            {message.content}
          </p>
        )}

        {/* IMAGE */}
        {message.file && message.file_type === "image" && (
          <img
            src={message.file}
            alt="attachment"
            className="mt-2 max-w-full rounded-lg border"
          />
        )}

        {/* FILE */}
        {message.file && message.file_type !== "image" && (
          <a
            href={message.file}
            target="_blank"
            className="text-xs underline mt-2 inline-block"
          >
            📎 Download ({message.file_type})
          </a>
        )}

        {/* TIME */}
        <div className="mt-1 text-right">
          <span
            className={`text-[10px] ${
              isOwn ? "text-white/70" : "text-gray-500"
            }`}
          >
            {timeString}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE (Your avatar — OPTIONAL, remove if unwanted) */}
      {isOwn && (
        <div className="ml-2">
          <img
            src="/placeholder.svg"
            alt=""
            className="w-8 h-8 rounded-full opacity-0" // hidden: keeps spacing correct
          />
        </div>
      )}
    </div>
  );
};

export default Message;
