import React, { useState } from "react";
import Navbar from "../Navbar";
import GlobalCreoleSocietyCard from "./GlobalCreoleSocietyCard";
import GroupSection from "./GroupSection";
import ShareModal from "../Feed/ShareModal";
import CommentsModal from "../Feed/CommentsModal";
import MyPostCard from "./MyPostCard";
import { useQuery } from "@tanstack/react-query";
import {
  getsingleuserpost,
  getsocietyData,
  getMemberships,
} from "../../API/api";
import { useParams } from "react-router-dom";

const MySociety = () => {
  const { id } = useParams();

  // ---------------------------
  // Society Info
  // ---------------------------
  const { data: societyData, isLoading: societyLoading } = useQuery({
    queryKey: ["societyData", id],
    queryFn: () => getsocietyData(id),
    enabled: !!id,
  });

  // ---------------------------
  // Society Members
  // ---------------------------
  const { data: showmembers } = useQuery({
    queryKey: ["societymembers", id],
    queryFn: () => getMemberships(id),
    enabled: !!id,
  });

  // ---------------------------
  // User's Posts inside the society
  // ---------------------------
  const { data: mypostdata } = useQuery({
    queryKey: ["getsingleuserpost", id],
    queryFn: () => getsingleuserpost(id),
    enabled: !!id,
  });
  console.log("post data test", mypostdata);
  // ---------------------------
  // Modal States
  // ---------------------------
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  return (
    <div className="bg-[#F3F4F6]">
      <Navbar />

      <section className="sm:grid grid-cols-12 gap-5 container mx-auto mt-6">
        {/* ====================================== */}
        {/* LEFT CARD - Society Info + Members */}
        {/* ====================================== */}
        <section className="col-span-4">
          <GlobalCreoleSocietyCard
            societyData={societyData}
            showmembers={showmembers}
          />
        </section>

        {/* ====================================== */}
        {/* RIGHT SIDE — POSTS */}
        {/* ====================================== */}
        <section className="col-span-8">
          <GroupSection />

          <div className="mt-5 space-y-4">
            {mypostdata?.results?.length > 0 ? (
              mypostdata.results.map((post) => (
                <MyPostCard
                  key={post.id}
                  post={post}
                  onComment={() => setActiveCommentPostId(post.id)}
                  onShare={() => setActiveSharePostId(post.id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No posts found.</p>
            )}
          </div>
        </section>
      </section>

      {/* ====================================== */}
      {/* Share & Comment Modals */}
      {/* ====================================== */}

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

export default MySociety;
