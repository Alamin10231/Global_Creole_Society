"use client";

import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { FaShareFromSquare } from "react-icons/fa6";
import CommentsModal from "./CommentsModal";

const PostCard = ({ post, onShare, onLike }) => {
  const author = post.user || {};
  const avatar = author.profile_image || "/placeholder.svg";
  const username = author.profile_name || author.name || author.email || "Unknown";

  const [showCommentModal, setShowCommentModal] = useState(false);

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm hover:scale-102 transition-transform">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-gray-900">{username}</h3>
            <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
        <button onClick={onShare} className="p-2 hover:bg-gray-100 rounded-full">
          <FaShareFromSquare className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-800 mb-3">{post.content}</p>
        {post.media?.map((file, index) => {
          const src = file?.file || file?.url || file;
          const type = file?.type || (src?.match(/\.mp4|\.webm/) ? "video" : "image");
          if (!src) return null;
          return type === "video" ? (
            <video key={index} src={src} controls className="w-full max-h-96 rounded-lg" />
          ) : (
            <img key={index} src={src} className="w-full max-h-96 object-cover rounded-lg" />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500"
          >
            <Heart className={`w-5 h-5 ${post.is_liked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="text-sm">{post.like_count} Likes</span>
          </button>

          <button
            onClick={() => setShowCommentModal(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comment_count || 0} Comments</span>
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={post.id}
      />
    </div>
  );
};

export default PostCard;
