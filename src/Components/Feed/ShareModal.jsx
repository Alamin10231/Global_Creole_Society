"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
// import { sharePostBulk, getInboxUsers } from "../../API/api";
import { useNavigate } from "react-router-dom";
import { getInboxUsers, sharePostBulk } from "../../API/api";

const ShareModal = ({ isOpen, onClose, postId }) => {
  const [shareMessage, setShareMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Fetch Inbox Users
  const { data: inboxUsers, isLoading } = useQuery({
    queryKey: ["inboxUsers"],
    queryFn: getInboxUsers,
    enabled: isOpen,
  });

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleShare = async () => {
    if (!postId || selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    try {
      await sharePostBulk({
        post_id: postId,
        user_ids: selectedUsers,
        society_ids: [],
        share_caption: shareMessage,
      });
      toast.success("Shared successfully!");
      setSelectedUsers([]);
      setShareMessage("");
      onClose();
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error("Failed to share post");
    }
  };

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div
        ref={popupRef}
        className="bg-white rounded-xl w-[50%] max-h-[90vh] overflow-auto min-w-[420px] p-4 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Share Post</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caption Input */}
        <textarea
          value={shareMessage}
          onChange={(e) => setShareMessage(e.target.value)}
          placeholder="Say something about this (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg resize-none mb-4"
          rows={4}
        />

        {/* Inbox Users */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Send in Inbox</h3>
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto">
              {inboxUsers?.results?.map((user) => {
                const u = user.other_participant;
                return (
                  <div
                    key={u.id}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div
                      onClick={() => toggleSelectUser(u.id)}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                        selectedUsers.includes(u.id)
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={u.profile_image || "/avatar.png"}
                        alt={u.profile_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs mt-1">{u.profile_name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
