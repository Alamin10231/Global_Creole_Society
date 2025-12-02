"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import ProfileHeader from "./ProfileHeader";
import AboutMe from "./AboutMe";
import FriendsGrid from "./FriendsGrid";
import Description from "./Description";
import PostCard from "../Components/Feed/PostCard";
import EditAboutModal from "./EditAboutModal";
import ShareModal from "../Components/Feed/ShareModal";
import CommentsModal from "../Components/Feed/CommentsModal";
import { getprofile, getsingleuserpost } from "../API/api";
// import { getprofile, getUserPosts } from "../API/api";   // ⭐ Add getUserPosts

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const editAboutmodal = useRef(null);

  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const handleOpenShareModal = (postId) => setActiveSharePostId(postId);
  const handleOpenCommentModal = (postId) => setActiveCommentPostId(postId);
  const closeShareModal = () => setActiveSharePostId(null);
  const closeCommentModal = () => setActiveCommentPostId(null);

  const handleEditAboutPopup = () =>
    setIsModalOpen((prev) => !prev);

  // Close Modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editAboutmodal.current && !editAboutmodal.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 Fetch Profile + Posts
  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await getprofile();
        setProfile(profileData);

        // ⭐ Fetch posts for this user
        const userPosts = await getsingleuserpost(profileData.id);
        setPosts(userPosts.results || userPosts || []);

      } catch (err) {
        console.error("Failed loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Failed to load profile</p>
      </div>
    );
  }

  // 🔥 Format backend data for ProfileHeader
  const profileData = {
    id: profile.id,
    name: profile.profile_name || "",
    username: profile.profile_name,
    profileImage: profile.profile_image || "/placeholder.svg",
    coverImage: "https://picsum.photos/800/200",
    followers: profile.friends_count,
    stats: {
      posts: posts.length,
      friends: profile.friends_count || 0,
      likes: profile.likes_count || 0,
    },
    about: {
      location: profile.locations?.[0]?.city || "",
      joined: new Date(profile.date_joined).toLocaleDateString(),
      workplace: profile.works?.[0]?.company || "",
    },
    description: profile.description,
  };

  return (
    <div className="relative bg-[#F0F0F0] pb-20 my-7">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div ref={editAboutmodal} className="bg-white rounded-lg p-6 shadow-xl">
            <EditAboutModal />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8 mt-5">

        <section className="pb-5 rounded-lg transform transition-transform duration-700 ease-out hover:scale-101">
          <ProfileHeader data={profileData} />
        </section>

        <section className="md:grid grid-cols-12 gap-5">

          <section className="col-span-4">
            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl hover:scale-103 transition-transform">
              <AboutMe handleEditAboutPopup={handleEditAboutPopup} data={profileData} />
            </div>

            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl hover:scale-103 transition-transform">
              <FriendsGrid data={profileData} />
            </div>
          </section>

          <section className="col-span-8">
            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl hover:scale-102 transition-transform">
              <Description data={profileData} />
            </div>

            {/* ⭐ LIST OF POSTS */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  No posts yet.
                </p>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onShare={() => handleOpenShareModal(post.id)}
                    onLike={() => console.log("Like post", post.id)}
                  />
                ))
              )}
            </div>
          </section>

        </section>
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

export default Profile;
