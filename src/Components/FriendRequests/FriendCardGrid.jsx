"use client";

import React from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFriendRequests, getFriendSuggessions, sendFriendRequest } from "../../API/api";

const FriendCardGrid = () => {
  const navigate = useNavigate();

  const { data: friendRequestData } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests,
  });

  const { data: addFriendData } = useQuery({
    queryKey: ["add-friends"],
    queryFn: getFriendSuggessions,
  });

  const addFriendMutation = useMutation({
    mutationFn: (friendId) => sendFriendRequest(friendId),
    onSuccess: () => alert("Friend Request Sent!"),
    onError: () => alert("Something went wrong!"),
  });

  const renderFriendCard = (friend, type) => {
    const userName = friend.profile_name || "Unknown";
    const userImage = friend.profile_image || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
      <div key={friend.id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center">
        <div className="flex justify-between items-start gap-5 w-full">
          <img src={userImage} alt={userName} className="w-20 h-20 rounded-full mb-2 object-cover" />
          <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">Follow</p>
        </div>

        <h3 className="text-lg font-semibold">{userName}</h3>
        <p className="text-gray-600">{friend.status || "N/A"}</p>

        {type === "requests" ? (
          <div className="flex space-x-2 mt-2">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Approve</button>
          </div>
        ) : (
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            onClick={() => addFriendMutation.mutate(friend.id)}
          >
            Add Friend
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-7">
        <Navbar />
      </div>

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-2">Friend Requests</h1>
            <p className="text-blue-500 text-sm sm:text-base">
              {friendRequestData?.results?.length || 0} Friend Requests
            </p>
          </div>
          <button
            onClick={() => navigate("/frient_requests/list")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        {/* Friend Requests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friendRequestData?.results?.map((friend) => renderFriendCard(friend, "requests"))}
        </div>

        {/* Add Friends Section */}
        <div className="flex items-center justify-between mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mt-6 my-3">Add Friends</h2>
          <button
            onClick={() => navigate("/frient_requests/add_friends")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        {/* Suggestion Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Array.isArray(addFriendData) ? addFriendData : []).map((friend) =>
            renderFriendCard(friend, "add")
          )}
        </div>
      </section>
    </div>
  );
};

export default FriendCardGrid;
