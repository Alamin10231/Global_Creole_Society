import React, { useState } from "react";
import Navbar from "../Navbar";
import GlobalCreoleSocietyCard from "./GlobalCreoleSocietyCard";
import GroupSection from "./GroupSection";
import ShareModal from "../Feed/ShareModal";
import CommentsModal from "../Feed/CommentsModal";
import MyPostCard from "./MyPostCard";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getsingleuserpost,
  getsocietyData,
  getMemberships,
  seethepost,
  toggleLike,
  getPendingPosts,
} from "../../API/api";
import { useParams } from "react-router-dom";
import MySocietycreatepost from "./MySocietycreatepost";

const MySociety = () => {
  const { id } = useParams();

  // Get society info
  const { data: societyData } = useQuery({
    queryKey: ["societyData", id],
    queryFn: () => getsocietyData(id),
    enabled: !!id,
  });
  // pending post 
  

  // Society Members
  const { data: showmembers } = useQuery({
    queryKey: ["societymembers", id],
    queryFn: () => getMemberships(id),
    enabled: !!id,
  });

  // Posts inside this Society
  const { data: mypostdata } = useQuery({
    queryKey: ["societyPosts", id],
    queryFn: () => getsingleuserpost(id),
    enabled: !!id,
  });

  // Profile
  const { data: seePostData } = useQuery({
    queryKey: ["seethepost", id],
    queryFn: () => seethepost(localStorage.getItem("userId")),
    enabled: !!id,
  });
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["societyPosts", id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          results: oldData.results.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  is_liked: !p.is_liked,
                  like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1,
                }
              : p
          ),
        };
      });
    },
  });

  const handleLike = (postId) => likeMutation.mutate(postId);
  const [activeSharePostId, setActiveSharePostId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  return (
    <div className="bg-[#F3F4F6]">
      <Navbar />

      <section className="sm:grid grid-cols-12 gap-5 container mx-auto mt-6">
        {/* LEFT SECTION */}
        <section className="col-span-4">
          <GlobalCreoleSocietyCard
            societyData={societyData}
            showmembers={showmembers}
            societyId={id}
            profile_image={seePostData?.user?.profile_image}
          />
        </section>

        {/* RIGHT SECTION */}
        <section className="col-span-8">
          <GroupSection />

          <div className="mt-5 space-y-4">
            <MySocietycreatepost
              societyId={id}
              profile_image={seePostData?.user?.profile_image}
            />
          </div>

          <div className="mt-5 space-y-4">
            {mypostdata?.results?.length > 0 ? (
              mypostdata.results.map((post) => (
                <MyPostCard
                  key={post.id}
                  post={post}
               
                  onComment={() => setActiveCommentPostId(post.id)}
                  onShare={() => setActiveSharePostId(post.id)}
                  onLike={() => handleLike(post.id)}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No posts found.</p>
            )}
          </div>
        </section>
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!activeSharePostId}
        onClose={() => setActiveSharePostId(null)}
        postId={activeSharePostId}
      />

      {/* Comment Modal */}
      <CommentsModal
        isOpen={!!activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
        postId={activeCommentPostId}
      />
    </div>
  );
};

export default MySociety;
