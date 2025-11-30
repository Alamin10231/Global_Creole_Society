"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StoriesSection from "./StoriesSection";
import CreatePostSection from "./CreatePostSection";
import PostCard from "./PostCard";
import CommentsModal from "./CommentsModal";
import ShareModal from "./ShareModal";
import { toast } from "sonner";
import { createpost, getpost, seethepost, toggleLike } from "../../API/api";
// import { createpost, getpost, seethepost, likePost } from "../../API/api";

const mockStories = [
  { id: "add", type: "add", title: "Add your reels" },
  { id: 1, username: "Morgan", avatar: "/avatar1.jpg", hasStory: true },
  { id: 2, username: "Stanley", avatar: "/avatar2.jpg", hasStory: true },
];

const SocialFeed = () => {
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getpost({}).then((d) => d.results),
  });

  // Profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => seethepost(localStorage.getItem("userId")),
  });

  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // Create Post Mutation
  const postMutation = useMutation(createpost, {
    onSuccess: async (data) => {
      try {
        const createdId = data?.id;
        if (createdId) {
          const fresh = await getpost(createdId);
          queryClient.setQueryData(["posts"], (old) => [fresh, ...(old ?? [])]);
        }
      } catch (err) {
        console.error("Error fetching created post:", err);
      }
      toast.success("Post created successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || "Failed to create post");
    },
  });

  const handleCreatePost = (postData) => postMutation.mutate(postData);

  // ----------------------------------------------------
  // LIKE SYSTEM MUTATION
  // ----------------------------------------------------
  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: (data, postId) => {
      queryClient.setQueryData(["posts"], (oldPosts) => {
        if (!oldPosts) return oldPosts;

        return oldPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_liked: !p.is_liked,
                like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1,
              }
            : p
        );
      });
    },
  });

  const handleLike = (postId) => likeMutation.mutate(postId);

  // ----------------------------------------------------

  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div className="min-h-screen">
      <StoriesSection stories={mockStories} />

      <CreatePostSection
        currentUser={JSON.parse(localStorage.getItem("profile"))?.user}
        onCreatePost={handleCreatePost}
        profile={profile}
      />

      <div className="space-y-4">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onComment={() => setActiveCommentPostId(post.id)}
            onShare={() => setActiveSharePostId(post.id)}
          />
        ))}
      </div>

      <ShareModal
        isOpen={!!activeSharePostId}
        onClose={() => setActiveSharePostId(null)}
        postId={activeSharePostId}
      />

      <CommentsModal
        isOpen={!!activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
        postId={activeCommentPostId}
      />
    </div>
  );
};

export default SocialFeed;
