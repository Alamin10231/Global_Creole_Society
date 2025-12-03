"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Video, ImageIcon } from "lucide-react";

const CreatePostSection = ({ currentUser, onCreatePost, profile }) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("content", postText);
    formData.append("privacy", "public");

    selectedFiles.forEach((file) => formData.append("media", file));

    onCreatePost(formData, selectedFiles); // pass files along
    setPostText("");
    setSelectedFiles([]);
    toast.success("Post submitted");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={profile?.profile_image || "/placeholder.svg"}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows="3"
            className="flex-1 border p-2 rounded"
            placeholder="Write your story today..."
          />
        </div>

        {/* Preview uploaded images */}
        {selectedFiles.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {selectedFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate("/feed/livestream")}
              className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              <Video className="w-5 h-5" /> Live
            </button>

            <label className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Media</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {(postText.trim() || selectedFiles.length > 0) && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePostSection;
