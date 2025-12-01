import React from "react";
import { FaShareFromSquare } from "react-icons/fa6";

const formatTimestamp = (value) => {
  if (!value) return "";
  try {
    const d = new Date(value);

    let hours = d.getHours();
    let minutes = d.getMinutes().toString().padStart(2, "0");
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const time = `${hours}:${minutes}${ampm}`;
    const date = `${d.getDate()} ${d.toLocaleString("en-US", {
      month: "long",
    })}`;

    return { time, date };
  } catch {
    return "";
  }
};

const MyPostCard = ({ post,  onShare }) => {
  const author = post.user || {};
  const avatar = author.profile_image || "/placeholder.svg";
  const username = author.profile_name || author.email || "Unknown";

  const { time, date } = formatTimestamp(post.created_at);

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
         
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{username}</h3>
            <p className="text-sm text-gray-500">
              {date} at {time}
            </p>
          </div>
        </div>

        <button onClick={onShare} className="p-2 hover:bg-gray-100 rounded-full">
          <FaShareFromSquare className="w-4 h-4 text-gray-500" />
        </button>
      </div>


      {/* POST TEXT */}
      <p className="text-gray-800">{post.content}</p>
      {/* POST MEDIA */}
      {post.media?.length > 0 &&
        post.media.map((file, i) => (
          <img
            key={i}
            src={file.file || file.url}
            className="w-full rounded-lg mt-3"
          />
        ))}
    </div>
  );
};

export default MyPostCard;
