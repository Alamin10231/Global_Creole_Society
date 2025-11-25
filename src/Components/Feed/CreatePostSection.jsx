import { useState } from "react";
import { Video, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreatePostSection = ({ currentUser, onCreatePost }) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // Delegates post creation to parent via `onCreatePost` prop so that
  // mutations and cache invalidation are centralized in the feed component.

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

    if (onCreatePost) {
      onCreatePost(formData);
      setPostText("");
      setSelectedFiles([]);
      toast.success("Post submitted");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={currentUser?.avatar || "/placeholder.svg"}
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
