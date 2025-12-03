"use client";

import React from "react";
import Navbar from "../Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFriendRequests, respondToFriendRequest } from "../../API/api";

const FriendRequestList = () => {
  const queryClient = useQueryClient();

  // Fetch friend requests
  const { data: friendRequestsData, isLoading } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: getFriendRequests,
  });

  // Mutation to respond (accept/reject) friend requests
  const respondMutation = useMutation({
    mutationFn: ({ requestId, accept }) =>
      respondToFriendRequest(requestId, accept),
    onMutate: async ({ requestId }) => {
      await queryClient.cancelQueries(["friend-requests"]);

      const previousData = queryClient.getQueryData(["friend-requests"]);

      queryClient.setQueryData(["friend-requests"], (oldData) => {
        return {
          ...oldData,
          results: oldData.results.filter((r) => r.id !== requestId),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["friend-requests"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["friend-requests"]);
    },
  });

  if (isLoading)
    return <p className="text-center mt-10">Loading friend requests...</p>;

  const loggedInUserId = localStorage.getItem("userId");

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold my-3">
            Friend Requests
          </h1>
          <p className="text-blue-500 text-sm sm:text-base">
            {friendRequestsData?.results?.length || 0} Friend requests
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friendRequestsData?.results?.map((request) => {
            // Show the other user (not the logged-in user)
            const user =
              request.receiver.id === loggedInUserId
                ? request.requester
                : request.receiver;

            return (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                <div className="flex justify-between items-start gap-5">
                  <img
                    src={
                      user.profile_image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={user.profile_name}
                    className="w-20 h-20 rounded-full mb-2 object-cover"
                  />
                  <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">
                    Follow
                  </p>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold">
                  {user.profile_name}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base capitalize">
                  {request.status}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
                    onClick={() =>
                      respondMutation.mutate({
                        requestId: request.id,
                        accept: false,
                      })
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    onClick={() =>
                      respondMutation.mutate({
                        requestId: request.id,
                        accept: true,
                      })
                    }
                  >
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestList;
