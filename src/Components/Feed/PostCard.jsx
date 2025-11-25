import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { FaShareFromSquare } from "react-icons/fa6";

const formatTimestamp = (value) => {
  if (!value) return "";
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return value;
  }
};

const PostCard = ({ post = {}, onComment, onShare }) => {
  // Backend may return different shapes: `user` or `author`, media as strings or objects.
  const author = post.user || post.content || post.created_by || {};
  const avatar = author.avatar || author.profile_image || "/placeholder.svg";
  const username = author.username || author.name || author.email || "Unknown";
  const timestamp = post.created_at || post.timestamp || author.timestamp || post.date;

  const initialLiked = !!post.isLiked || !!post.liked;
  const initialLikes = Number(post.likes || post.likes_count || post.reactions || 0);

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));
  };

  const media = Array.isArray(post.media) ? post.media : post.media ? [post.media] : post.attachments || [];

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm transform transition-transform duration-700 ease-out hover:scale-102">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{username}</h3>
            <p className="text-sm text-gray-500">{formatTimestamp(timestamp)}</p>
          </div>
        </div>
        <button
          onClick={onShare}
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
        >
          <FaShareFromSquare className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="mb-3">
        <p className="text-gray-800 mb-3">{post.content || post.text || post.body}</p>

        {/* Render multiple media (handle string or object media entries) */}
        {media.map((file, index) => {
          const src = file?.url || file?.file || file;
          const type = file?.type || (typeof src === "string" && src.match(/\.mp4|\.webm/) ? "video" : "image");
          if (!src) return null;
          return type === "video" ? (
            <video key={index} src={src} controls className="w-full max-h-96 rounded-lg" />
          ) : (
            <img key={index} src={src} alt={`media-${index}`} className="w-full max-h-96 object-cover rounded-lg" />
          );
        })}

      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className="cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="text-sm">{likesCount} Likes</span>
          </button>
          <button
            onClick={onComment}
            className="cursor-pointer flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments || post.comments_count || 0} Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
