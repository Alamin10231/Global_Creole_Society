"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../Navbar";
import { getFriendRequests } from "../../API/api";
// import { sendfriendrequest } from "../../API/api";
// import { getfriendrequests } from "../../API/api";

const FriendRequestList = () => {
  // Fetch friend requests (may return array or paginated object { results })
  const {
    data: friendRequests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => getFriendRequests(),
  });

  // Normalize to an array so `.map` won't fail if API returns { results: [...] }
  const requests = Array.isArray(friendRequests)
    ? friendRequests
    : friendRequests?.results || [];

  React.useEffect(() => {
    if (!isLoading) {
      const normalized = Array.isArray(friendRequests)
        ? friendRequests
        : friendRequests?.results || [];
      console.log("friendRequests list:", normalized);
    }
  }, [isLoading, friendRequests]);

  if (isLoading)
    return <p className="text-center mt-10">Loading requests...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load friend requests
        {error?.message ? `: ${error.message}` : null}
      </p>
    );
  if (!requests.length)
    return (
      <div>
        <Navbar />
        <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
          <h1 className="text-2xl sm:text-3xl font-bold my-3">
            Friends requests
          </h1>
          <p className="text-gray-600">No pending requests</p>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-3">
              Friends requests
            </h1>
            <p className="text-blue-500 text-sm sm:text-base">
              {requests.length} Friend requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requests.map((friend, idx) => {
            const key =
              friend?.id ?? friend?.user_id ?? friend?.user?.id ?? idx;
            const avatar =
              friend?.avatar ||
              friend?.profile_image ||
              friend?.user?.avatar ||
              friend?.user?.profile_image ||
              "/placeholder.svg";
            const name =
              friend?.name ||
              friend?.profile_name ||
              friend?.full_name ||
              friend?.user?.name ||
              friend?.user?.username ||
              "Unknown User";
            const status = friend?.status || friend?.bio || friend?.about || "";
            return (
              <div
                key={key}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  src={avatar}
                  alt={name}
                  className="w-18 h-18 rounded-full mb-2"
                />
                <h3 className="text-lg sm:text-xl font-semibold">{name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{status}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto">
                    Cancel
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">
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
