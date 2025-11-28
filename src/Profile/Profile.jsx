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
import { getprofile } from "../API/api";

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

  const handleEditAboutPopup = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Click outside Modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editAboutmodal.current &&
        !editAboutmodal.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔥 Fetch Profile From API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user id from localStorage

        // If no userId found → stop API call

        // Call your API
        const data = await getprofile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
    username: profile.profile_name, // only it was working
    profileImage: profile.profile_image || "/placeholder.svg",
    coverImage: "https://picsum.photos/800/200", // You can add a real API field later
    industry: "",
    location: profile.locations?.[0]?.city || "",
    followers: profile.friends_count,
    stats: {
      posts: profile.post_count || 0,
      friends: profile.friends_count || 0,
      likes: profile.likes_count || 0,
    },
    about: {
      location: profile.locations?.[0]?.city || "",
      joined: new Date(profile.date_joined).toLocaleDateString(),
      workplace: profile.works?.[0]?.company || "",
    },
    description: profile.description,
    values: [],
  };

  return (
    <div className="relative bg-[#F0F0F0] pb-20 my-7">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            ref={editAboutmodal}
            className="bg-white rounded-lg p-6 shadow-xl"
          >
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

      <nav>
        <Navbar />
      </nav>

      <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8 mt-5">
        <section className="pb-5 rounded-lg transform transition-transform duration-700 ease-out hover:scale-101">
          <ProfileHeader data={profileData} />
        
        </section>

        <section className="md:grid grid-cols-12 gap-5">
          <section className="col-span-4">
            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl transform transition-transform duration-700 ease-out hover:scale-103">
              <AboutMe handleEditAboutPopup={handleEditAboutPopup} data={profileData} />
            </div>

            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl transform transition-transform duration-700 ease-out hover:scale-103">
              <FriendsGrid data={profileData} />
            </div>
          </section>

          <section className="col-span-8">
            <div className="bg-white rounded-lg mb-5 p-8 shadow-xl transform transition-transform duration-700 ease-out hover:scale-102">
              <Description data={profileData} />
            </div>

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
