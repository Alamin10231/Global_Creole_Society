import { useState } from "react";
import { toast } from "sonner";
import { Video, ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../API/api";

const MySocietycreatepost = ({ societyId, profile_image }) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const queryClient = useQueryClient();

  // Create society post mutation
  const postMutation = useMutation(createPost, {
    onSuccess: () => {
      toast.success("Post created!");
      queryClient.invalidateQueries(["societyPosts", societyId]);
      setPostText("");
      setSelectedFiles([]);
    },
    onError: () => toast.error("Failed to create post"),
  });
  console.log("Society ID in create post:", societyId);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!postText.trim() && selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("content", postText);
    formData.append("society", societyId); // 🔥 IMPORTANT: makes it a society-only post

    selectedFiles.forEach((file) => formData.append("media_files", file));

    postMutation.mutate(formData);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <img
            src={profile_image || "/placeholder.svg"}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows="3"
            className="flex-1 border p-2 rounded"
            placeholder="Share something with the group..."
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {selectedFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt=""
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
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

export default MySocietycreatepost;
