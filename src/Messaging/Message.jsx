import React from "react";

const Message = ({ message }) => {
  const isOwn = message.isOwn;

  return (
    <div
      className={`flex mb-3 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Profile Image */}
      {!isOwn && (
        <img
          src={message.sender_image}
          alt="avatar"
          className="w-9 h-9 rounded-full mr-2"
        />
      )}

      <div
        className={`max-w-xs p-3 rounded-xl shadow 
          ${isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}
        `}
      >
        {/* Sender Name (other user only) */}
        {!isOwn && (
          <p className="text-xs font-semibold mb-1">
            {message.sender_name}
          </p>
        )}

        {/* TEXT MESSAGE */}
        {message.content && (
          <p className="whitespace-pre-line">{message.content}</p>
        )}

        {/* IMAGE PREVIEW */}
        {message.file && message.file_type === "image" && (
          <img
            src={message.file}
            alt="attachment"
            className="mt-2 max-w-xs rounded-lg border"
          />
        )}

        {/* OTHER FILES → PDF, VIDEO, AUDIO, DOC, ZIP etc */}
        {message.file && message.file_type !== "image" && (
          <a
            href={message.file}
            target="_blank"
            className="block mt-2 text-sm underline text-yellow-300"
          >
            📎 Download File ({message.file_type})
          </a>
        )}

        {/* Time */}
        <p className="text-[10px] mt-1 opacity-70">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default Message;
