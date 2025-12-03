"use client";

import React from "react";
import Navbar from "../Navbar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFriendRequests, respondToFriendRequest } from "../../API/api";

const FriendRequests = () => {
  // ✅ Fetch friend requests
  const { data: friendRequests, isLoading, refetch } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests, // use GET API
  });

  // ✅ Mutation to approve/reject friend request
  const respondMutation = useMutation({
    mutationFn: ({ requestId, accept }) =>
      respondToFriendRequest(requestId, accept),
    onSuccess: () => {
      alert("Friend request updated!");
      refetch(); // refresh list after approve/reject
    },
    onError: () => {
      alert("Something went wrong!");
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading friend requests...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
     

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold my-2">Friend Requests</h1>
          <p className="text-blue-500 text-sm sm:text-base">
            {friendRequests?.results?.length || 0} Requests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friendRequests?.results?.map((request) => {
            // Show the other user (not yourself)
            const user =
              request.receiver.id === localStorage.getItem("userId")
                ? request.requester
                : request.receiver;

            return (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  src={user.profile_image || "/placeholder.svg"}
                  alt={user.profile_name}
                  className="w-18 h-18 rounded-full mb-2"
                />
                <h3 className="text-lg font-semibold">{user.profile_name}</h3>
                <p className="text-gray-600">{request.status}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() =>
                      respondMutation.mutate({ requestId: request.id, accept: false })
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() =>
                      respondMutation.mutate({ requestId: request.id, accept: true })
                    }
                  >
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FriendRequests;
