"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { commentPost, seecomments } from "../../API/api";

const CommentsModal = ({ isOpen, onClose, postId }) => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const popupRef = useRef(null);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCommentInput("");
      // optional: clear comments so it doesn't flash old ones when reopened
      setComments([]);
    }
  }, [isOpen]);

  // Fetch comments when modal opens or postId changes
  useEffect(() => {
    if (!isOpen || !postId) return;

    let isCancelled = false;

    const fetchComments = async () => {
      try {
        setIsFetching(true);
        setComments([]); // clear old comments for previous post

        const data = await seecomments(postId);
        if (!isCancelled) {
          setComments(data?.results || data || []);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to fetch comments:", err);
        }
      } finally {
        if (!isCancelled) {
          setIsFetching(false);
        }
      }
    };

    fetchComments();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, postId]);

  // Close modal on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Post a new comment
  const handlePostComment = async () => {
    if (!commentInput.trim() || isPosting) return;

    try {
      setIsPosting(true);

      await commentPost(postId, commentInput);

      // Clear input
      setCommentInput("");

      // Re-fetch comments so you see your new one along with all previous
      const data = await seecomments(postId);
      setComments(data?.results || data || []);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsPosting(false);
    }
  };

  // Post comment on Enter key (Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div
        ref={popupRef}
        className="bg-white rounded-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto shadow-lg p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {isFetching && (
            <p className="text-gray-500 text-sm">Loading comments...</p>
          )}

          {!isFetching && comments.length === 0 && (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}

          {!isFetching &&
            comments.map((c) => (
              <div key={c.id} className="flex items-start space-x-3">
                <img
                  src={c.user?.profile_image || "/placeholder.svg"}
                  alt={c.user?.profile_name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {c.user?.profile_name || "Unknown"}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">{c.content}</p>
                  <span className="text-gray-500 text-xs">
                    {new Date(c.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Comment Input */}
        <div className="mt-4 border-t border-gray-200 pt-3">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            onKeyDown={handleKeyPress}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handlePostComment}
              disabled={isPosting || !commentInput.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {isPosting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
