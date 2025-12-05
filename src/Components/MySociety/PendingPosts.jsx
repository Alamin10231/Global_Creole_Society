import React, { useState } from "react";
import Navbar from "../Navbar";
import { RiMenuAddLine } from "react-icons/ri";
import PendingPostCard from "./PendingPostCard";
import { getPendingPosts, rejectpost } from "../../API/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const PendingPosts = () => {
  const { id: societyId } = useParams(); 

  console.log("Society ID:", societyId);

  // Fetch pending posts
  const { data: pendingPosts, isLoading } = useQuery({
    queryKey: ["pendingPosts", societyId],
    queryFn: () => getPendingPosts(societyId),
    enabled: !!societyId,
  });

  const [removedIds, setRemovedIds] = useState([]);

  // -----------------------------
  // 🔥 Reject Post Handler
  // -----------------------------
  const handleReject = async (postId) => {
    try {
      await rejectpost(postId);       // ✔ Only send POST ID
      setRemovedIds((prev) => [...prev, postId]); // remove from UI
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  console.log("🔥 Pending Posts API Response:", pendingPosts);

  // remove posts that were rejected or approved
  const postsToShow = pendingPosts?.results?.filter(
    (post) => !removedIds.includes(post.id)
  );

  if (!societyId) {
    return (
      <p className="p-10 text-center text-red-500">
        ❌ Society ID missing in URL
      </p>
    );
  }

  if (isLoading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-[#E2E8F0]/60">
      <Navbar />

      <div className="container mx-auto mt-5">
        <div className="bg-white px-4 py-3 rounded-xl flex items-center gap-5">
          <input
            type="search"
            placeholder="Search post"
            className="bg-black/10 font-semibold px-4 py-3 rounded-xl text-[#92929D] w-full"
          />
          <RiMenuAddLine
            size={40}
            className="bg-[#3B82F6] cursor-pointer p-2 rounded-lg"
            color="white"
          />
        </div>

        <h3 className="text-2xl font-bold my-5">Pending Posts</h3>

        <div className="space-y-4">
          {postsToShow?.length > 0 ? (
            postsToShow.map((post) => (
              <PendingPostCard
                key={post.id}
                post={post}
                onShare={() => {}}
                onApproved={(id) => setRemovedIds((prev) => [...prev, id])}
                onReject={() => handleReject(post.id)} // <-- ✔ Added reject here
              />
            ))
          ) : (
            <p className="text-center text-gray-600">
              No pending posts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingPosts;
