"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { commentPost, seecomments } from "../../API/api";

const CommentsModal = ({ isOpen, onClose, postId }) => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const popupRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch comments when modal opens
  useEffect(() => {
    if (!isOpen || !postId) return;

    const fetchComments = async () => {
      try {
        setIsFetching(true);
        const data = await seecomments(postId);
        setComments(data?.results || data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchComments();
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

  // Post a comment
  const handlePostComment = async () => {
    if (!commentInput.trim() || isPosting) return;

    try {
      setIsPosting(true);

      await commentPost(postId, commentInput);
      setCommentInput("");

      // Refresh comments
      const data = await seecomments(postId);
      setComments(data?.results || data || []);

      // Update posts cache comment count
      try {
        queryClient.setQueryData(["posts"], (oldData) => {
          if (!oldData) return oldData;

          // Array shape
          if (Array.isArray(oldData)) {
            return oldData.map((p) =>
              p.id === postId
                ? { ...p, comment_count: (p.comment_count || 0) + 1 }
                : p
            );
          }

          // Paginated shape
          if (oldData?.results) {
            return {
              ...oldData,
              results: oldData.results.map((p) =>
                p.id === postId
                  ? { ...p, comment_count: (p.comment_count || 0) + 1 }
                  : p
              ),
            };
          }

          return oldData;
        });

        queryClient.invalidateQueries("getsingleuserpost");
      } catch (e) {
        console.error("Failed to update posts cache:", e);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsPosting(false);
    }
  };

  // Enter = post comment
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div
        ref={popupRef}
        className="bg-white rounded-xl w-[90%] sm:w-3/5 h-[80vh] sm:h-[60vh] overflow-y-auto shadow-lg p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-xl font-bold">Comments</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
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
        <div className="mt-4 border-t pt-3">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            onKeyDown={handleKeyPress}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
