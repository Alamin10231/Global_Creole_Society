"use client";

import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { FaShareFromSquare } from "react-icons/fa6";
import CommentsModal from "./CommentsModal";

const PostCard = ({ post, onShare, onLike }) => {
  const author = post.user || {};
  const avatar = author.profile_image || "/placeholder.svg";
  const username =
    author.profile_name || author.name || author.email || "Unknown";

  const [showCommentModal, setShowCommentModal] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg hover:scale-[1.01] transition-transform">
      {/* HEADER */}
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
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <button onClick={onShare} className="p-2 hover:bg-gray-100 rounded-full">
          <FaShareFromSquare className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* CONTENT */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {post.media?.map((file, index) => {
        const src = file.file || file.url || file;
        const type = src.match(/\.(mp4|webm)$/) ? "video" : "image";

        if (type === "video") {
          return (
            <video
              key={index}
              src={src}
              controls
              className="w-full max-h-96 rounded-lg mb-3"
            />
          );
        }

        return (
          <img
            key={index}
            src={src}
            className="w-full max-h-96 rounded-lg object-cover mb-3"
          />
        );
      })}

      {/* ACTION BAR */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <Heart
            className={`w-5 h-5 ${
              post.is_liked ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{post.like_count} Likes</span>
        </button>

        <button
          onClick={() => setShowCommentModal(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comment_count || 0} Comments</span>
        </button>
      </div>

      <CommentsModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={post.id}
      />
    </div>
  );
};

export default PostCard;
