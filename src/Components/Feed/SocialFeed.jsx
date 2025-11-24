"use client"

import { useState } from "react"
import StoriesSection from "./StoriesSection"
import CreatePostSection from "./CreatePostSection"
import PostCard from "./PostCard"
import CommentsModal from "./CommentsModal"
import ShareModal from "./ShareModal"
import { createpost } from "../../API/api"
// import { createpost } from "@/api/api"  // ⭐ import API

const mockStories = [ /* same */ ]
const mockPosts = [ /* same */ ]

const SocialFeed = () => {
    const [posts, setPosts] = useState(mockPosts)

    const [activeSharePostId, setActiveSharePostId] = useState(null)
    const [activeCommentPostId, setActiveCommentPostId] = useState(null)

    // ⭐ Backend integrated create post
    const handleCreatePost = async (postData) => {
        try {
            const res = await createpost(postData);

            const createdPost = {
                id: res.data.id,
                user: {
                    username: res.data.user?.username || "You",
                    avatar: res.data.user?.avatar ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
                    timestamp: "just now",
                },
                content: res.data.content,
                image: res.data.image || null,
                likes: 0,
                comments: 0,
                isLiked: false,
            };

            setPosts((prev) => [createdPost, ...prev]);
        } catch (error) {
            console.log("❌ Post creation failed", error);
        }
    };

    const handleOpenShareModal = (postId) => setActiveSharePostId(postId)
    const handleOpenCommentModal = (postId) => setActiveCommentPostId(postId)
    const closeShareModal = () => setActiveSharePostId(null)
    const closeCommentModal = () => setActiveCommentPostId(null)

    return (
        <div className="min-h-screen">
            <StoriesSection stories={mockStories} />

            <CreatePostSection
                currentUser={{
                    username: "Ryan",
                    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s",
                }}
                onCreatePost={handleCreatePost}  // ⭐ integrated
            />

            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onComment={() => handleOpenCommentModal(post.id)}
                        onShare={() => handleOpenShareModal(post.id)}
                    />
                ))}
            </div>

            <ShareModal isOpen={!!activeSharePostId} onClose={closeShareModal} postId={activeSharePostId} />
            <CommentsModal isOpen={!!activeCommentPostId} onClose={closeCommentModal} postId={activeCommentPostId} />
        </div>
    )
}

export default SocialFeed
