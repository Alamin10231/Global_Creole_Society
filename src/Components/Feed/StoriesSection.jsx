"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
// import { getstories, poststories } from "../../API/api";
// import { toast } from "sonner";
// import { getstories, poststories } from "../../API/api";

const StoriesSection = () => {
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState("");
  const [newStoryFiles, setNewStoryFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [privacy, setPrivacy] = useState("public");
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch stories
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: getstories,
  });

  const stories = data?.results || data || [];

  // Restore temp stories from localStorage
  useEffect(() => {
    const tempStories = localStorage.getItem("tempStories");
    if (tempStories) {
      const parsed = JSON.parse(tempStories);
      queryClient.setQueryData(["stories"], parsed);
    }
  }, [queryClient]);

  // Update localStorage whenever stories change
  useEffect(() => {
    if (stories.length > 0) {
      localStorage.setItem("tempStories", JSON.stringify(stories));
    }
  }, [stories]);

  const createStoryMutation = useMutation({
    mutationFn: (formData) => poststories(formData),
    onSuccess: (newStory) => {
      toast.success("Story created successfully!");
      setShowCreateModal(false);
      setNewStoryContent("");
      setNewStoryFiles([]);
      setPreviewImages([]);

      // যদি backend media array empty থাকে, temporary previewImages ব্যবহার করব
      if (previewImages.length > 0 && (!newStory.media || newStory.media.length === 0)) {
        newStory.media = previewImages.map((src) => ({ url: src }));
      }

      // নতুন story cache-এ push
      queryClient.setQueryData(["stories"], (oldData) => {
        if (!oldData) return [newStory];
        if (oldData.results) {
          return { ...oldData, results: [newStory, ...oldData.results] };
        }
        return [newStory, ...oldData];
      });
    },
    onError: () => toast.error("Failed to create story"),
  });

  const handleCreateStorySubmit = () => {
    if (!newStoryContent && newStoryFiles.length === 0) {
      toast.error("Please add content or media");
      return;
    }
    const formData = new FormData();
    formData.append("content", newStoryContent);
    formData.append("privacy", privacy);
    newStoryFiles.forEach((file) => formData.append("media", file));
    createStoryMutation.mutate(formData);
  };

  if (isLoading) return <p className="p-4">Loading stories...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Failed to load stories</p>;

  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {/* Add Story */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-32 h-38 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <span className="text-xs text-gray-600 mt-2 text-center max-w-16 truncate">
            Add Story
          </span>
        </div>

        {/* Story Items */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="w-32 h-38 rounded-xl overflow-hidden">
              <img
                src={
                  story.media?.[0]?.file ??
                  story.media?.[0]?.image ??
                  story.media?.[0]?.url ??
                  "/placeholder.svg"
                }
                className="w-full h-full rounded-xl object-cover"
                alt="Story Media"
              />
            </div>
            <span className="text-xs text-gray-600 mt-2 text-center max-w-16 truncate">
              {story.user?.profile_name || "User"}
            </span>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-4 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-lg font-bold mb-2">Create Story</h2>

            <textarea
              placeholder="Write something..."
              value={newStoryContent}
              onChange={(e) => setNewStoryContent(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              rows={3}
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewStoryFiles(files);
                setPreviewImages(
                  files.map((file) => URL.createObjectURL(file))
                );
              }}
              className="mb-2"
            />

            {previewImages.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto">
                {previewImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            <button
              onClick={handleCreateStorySubmit}
              className="px-3 py-1 bg-blue-600 text-white rounded w-full hover:bg-blue-700 transition"
            >
              Share Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesSection;