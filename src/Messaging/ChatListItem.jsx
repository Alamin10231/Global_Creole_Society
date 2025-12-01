"use client";

import formatRelativeTime from "../Hook/TimeFormat";

function ChatListItem({ chat, isSelected, onClick }) {
  const user = chat.other_participant;
  const lastMessage = chat.last_message;

  const avatar = user?.profile_image;
  const name = user?.profile_name;
  const messageText = lastMessage?.content;
  const time = formatRelativeTime(lastMessage?.created_at);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-100 ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {name}
          </h3>
          <span className="text-xs text-gray-500">{time}</span>
        </div>

        <p className="text-sm text-gray-600 truncate">
          {messageText || "No messages yet"}
        </p>
      </div>

      {/* Unread badge */}
      {chat.unread_count > 0 && (
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );
}

export default ChatListItem;
