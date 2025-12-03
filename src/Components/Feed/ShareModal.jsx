"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronRight } from "lucide-react";
import { feedsharepost, feedbulsharepost } from "../../API/api"; // adjust path

const ShareModal = ({ isOpen, onClose, postData }) => {
  const [shareMessage, setShareMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedSocieties, setSelectedSocieties] = useState([]);

  const popupRef = useRef(null);

  // Mock data for users and societies
  const mockUsers = [
    { id: 1, name: "Ahmad", avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg" },
    { id: 2, name: "Ahmad", avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg" },
  ];

  const mockSocieties = [
    { id: 1, name: "Society A", avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg", isSelected: true },
    { id: 2, name: "Society B", avatar: "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg", isSelected: false },
  ];

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSocietySelect = (societyId) => {
    setSelectedSocieties((prev) =>
      prev.includes(societyId) ? prev.filter((id) => id !== societyId) : [...prev, societyId]
    );
  };

  // Share single post (Inbox/Individual)
  const handleShareNow = async () => {
    if (!postData?.id) return;

    try {
      const payload = {
        post_id: postData.id,
        share_caption: shareMessage,
        society_id: selectedSocieties.length > 0 ? selectedSocieties[0] : null, // first selected society
      };

      const response = await feedsharepost(payload);
      console.log("Single Share Successful:", response);
      onClose();
    } catch (error) {
      console.error("Single Share Error:", error);
    }
  };

  // Share bulk (Group/Society)
  const handleShare = async () => {
    if (!postData?.id) return;

    try {
      const payload = {
        post_id: postData.id,
        share_caption: shareMessage,
        society_ids: selectedSocieties.length > 0 ? selectedSocieties : [], // send array for bulk
        user_ids: selectedUsers.length > 0 ? selectedUsers : [], // send array of user IDs
      };

      const response = await feedbulsharepost(payload);
      console.log("Bulk Share Successful:", response);
      onClose();
    } catch (error) {
      console.error("Bulk Share Error:", error);
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        ref={popupRef}
        className="bg-white rounded-xl w-[50%] max-h-[90vh] overflow-hidden transform transition-transform duration-500 ease-out min-w-[420px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Share</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Caption input */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="https://media.istockphoto.com/id/492529287/photo/portrait-of-happy-laughing-man.jpg?s=612x612&w=0&k=20&c=0xQcd69Bf-mWoJYgjxBSPg7FHS57nOfYpZaZlYDVKRE="
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-bold text-gray-900">Your Name</span>
            </div>

            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Say something about this (optional)"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={handleShareNow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
              >
                Share now
              </button>
            </div>
          </div>

          {/* Send in Message */}
          <div className="px-4 py-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Send in Message</h3>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 gap-5">
              {mockUsers.map((user) => (
                <div key={user.id} className="flex-shrink-0 text-center">
                  <button
                    onClick={() => handleUserSelect(user.id)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${
                      selectedUsers.includes(user.id) ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </button>
                  <span className="text-xs text-gray-600 mt-1 block">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send in Society */}
          <div className="px-4 py-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Send in Society</h3>
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 gap-5">
              {mockSocieties.map((society) => (
                <div key={society.id} className="flex-shrink-0 text-center">
                  <button
                    onClick={() => handleSocietySelect(society.id)}
                    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${
                      selectedSocieties.includes(society.id) || society.isSelected ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={society.avatar} alt={society.name} className="w-full h-full object-cover" />
                  </button>
                  <span className="text-xs text-gray-600 mt-1 block">{society.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bulk Share */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleShare}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
