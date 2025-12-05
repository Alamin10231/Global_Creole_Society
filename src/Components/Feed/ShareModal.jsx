"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { feedsharepost, feedbulsharepost } from "../../API/api";

const ShareModal = ({ isOpen, onClose, postData, societyList }) => {
  const [shareMessage, setShareMessage] = useState("");
  const [selectedUsers] = useState([]);
  const [selectedSocieties, setSelectedSocieties] = useState([]);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Select User
  // Keep for future direct message selection (currently unused)
  // const handleUserSelect = (userId) => {
  //   setSelectedUsers((prev) =>
  //     prev.includes(userId)
  //       ? prev.filter((id) => id !== userId)
  //       : [...prev, userId]
  //   );
  // };

  // Select Society
  const handleSocietySelect = (societyId) => {
    setSelectedSocieties((prev) =>
      prev.includes(societyId)
        ? prev.filter((id) => id !== societyId)
        : [...prev, societyId]
    );
  };

  // Share Now = Single Society
  const handleShareNow = async () => {
    if (!postData?.id) return;
    try {
      await feedsharepost({
        post_id: postData.id,
        share_caption: shareMessage,
        society_id: selectedSocieties[0] || null,
      });
      onClose();
      navigate("/chat");
    } catch (err) {
      console.log("Share Error", err);
    }
  };

  // Bulk Share = Multi User/Society
  const handleBulkShare = async () => {
    if (!postData?.id) return;
    try {
      await feedbulsharepost({
        post_id: postData.id,
        share_caption: shareMessage,
        user_ids: selectedUsers,
        society_ids: selectedSocieties,
      });
      onClose();
      navigate("/chat");
    } catch (err) {
      console.log("Bulk Share Error", err);
    }
  };

  // Close outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl w-[600px] max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Share</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Caption */}
          <div className="p-4 border-b">
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Say something about this post..."
              className="w-full p-3 border rounded-lg resize-none focus:ring focus:ring-blue-500"
              rows={4}
            />
            <div className="text-right mt-2"></div>
          </div>

          {/* Send in Message */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Send in Message</h3>

              <button
                onClick={handleShareNow}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedSocieties.length > 0
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={selectedSocieties.length === 0}
              >
                Share now
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {societyList?.results?.map((society) => (
                <div key={society.id} className="text-center flex-shrink-0">
                  <button
                    onClick={() => handleSocietySelect(society.id)}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                      selectedSocieties.includes(society.id)
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        society.logo ||
                        society.other_participant?.profile_image ||
                        "https://via.placeholder.com/50"
                      }
                      alt={society.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <span className="text-xs block mt-1">{society.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Send in Society */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Send in Society</h3>
              <button
                onClick={() => navigate("/chat")}
                className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer"
              >
                Go to Chat
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {societyList?.results?.map((society) => (
                <div key={society.id} className="text-center flex-shrink-0">
                  <button
                    onClick={() => handleSocietySelect(society.id)}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden ${
                      selectedSocieties.includes(society.id)
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={
                        society.logo ||
                        society.profile_image ||
                        "https://via.placeholder.com/50"
                      }
                      alt={society.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <span className="text-xs block mt-1">{society.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleBulkShare}
            className={`px-6 py-2 rounded-lg text-white ${
              selectedSocieties.length > 0
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={selectedSocieties.length === 0}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
