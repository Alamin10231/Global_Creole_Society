"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StoriesSection from "./StoriesSection";
import CreatePostSection from "./CreatePostSection";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";
import ShareModal from "./ShareModal";
// import { createpost, getpost, getPost } from "../../API/api";
import { toast } from "sonner";
import { createpost, getpost, getposts } from "../../API/api";

const mockStories = [
  { id: "add", type: "add", title: "Add your reels" },
  { id: 1, username: "Morgan", avatar: "/avatar1.jpg", hasStory: true },
  { id: 2, username: "Stanley", avatar: "/avatar2.jpg", hasStory: true },
];

const SocialFeed = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getpost({}).then((data) => data.results), // getpost now returns res.data
  });

  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const postMutation = useMutation(createpost, {
    onSuccess: async (data) => {
      try {
        const createdId = data?.id;
        if (createdId) {
          // Fetch authoritative post from server and insert into cache
          const fresh = await getpost(createdId);
          queryClient.setQueryData(["posts"], (oldData) => {
            if (Array.isArray(oldData)) return [fresh, ...oldData];
            if (oldData && Array.isArray(oldData.results))
              return { ...oldData, results: [fresh, ...oldData.results] };
            return [fresh];
          });
        } else {
          queryClient.invalidateQueries(["posts"]);
        }
      } catch (err) {
        console.error("Error fetching created post:", err);
        queryClient.invalidateQueries(["posts"]);
      }
      toast.success("Post created successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to create post");
    },
  });

  const handleCreatePost = (postData) => postMutation.mutate(postData);
  const handleOpenShareModal = (postId) => setActiveSharePostId(postId);
  const handleOpenCommentModal = (postId) => setActiveCommentPostId(postId);
  const closeShareModal = () => setActiveSharePostId(null);
  const closeCommentModal = () => setActiveCommentPostId(null);

  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div className="min-h-screen">
      <StoriesSection stories={mockStories} />
      <CreatePostSection
        currentUser={JSON.parse(localStorage.getItem("profile"))?.user}
        onCreatePost={handleCreatePost}
      />

      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onComment={() => handleOpenCommentModal(post.id)}
            onShare={() => handleOpenShareModal(post.id)}
          />
        ))}
      </div>

      <ShareModal
        isOpen={!!activeSharePostId}
        onClose={closeShareModal}
        postId={activeSharePostId}
      />
      <CommentsModal
        isOpen={!!activeCommentPostId}
        onClose={closeCommentModal}
        postId={activeCommentPostId}
      />
    </div>
  );
};

export default SocialFeed;
