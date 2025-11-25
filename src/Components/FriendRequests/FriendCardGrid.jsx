import React from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAddFriends, getFriendRequests } from "../../API/api";
// import { getFriendRequests, getAddFriends } from "../../API/api";

const FriendCardGrid = () => {
  const navigate = useNavigate();

  // Load friend requests from backend (GET)
  const { data: friendRequests = [], isLoading: loadingReq } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  // Load add friends suggestions (GET)
  const { data: addFriends = [], isLoading: loadingAdd } = useQuery({
    queryKey: ["addFriends"],
    queryFn: getAddFriends,
  });

  // Normalize API shapes: backend may return an array or a paginated object { results: [...] }
  const requests = Array.isArray(friendRequests)
    ? friendRequests
    : friendRequests?.results || [];
  const suggestions = Array.isArray(addFriends)
    ? addFriends
    : addFriends?.results || [];

  const renderFriendCard = (friend, type) => (
    <div
      key={friend.id}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
    >
      <div className="flex justify-between items-start gap-5">
        <img
          src={friend.avatar || "/placeholder.svg"}
          alt={friend.name}
          className="w-18 h-18 rounded-full mb-2"
        />
        <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">Follow</p>
      </div>

      <h3 className="text-lg font-semibold">{friend.name}</h3>
      <p className="text-gray-600">{friend.status}</p>

      {type === "requests" ? (
        <div className="flex space-x-2 mt-2">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Approve
          </button>
        </div>
      ) : (
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Friend
        </button>
      )}
    </div>
  );

  if (loadingReq || loadingAdd) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-7">
        <Navbar />
      </div>

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        {/* Friend Requests Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-2">
              Friend Requests
            </h1>
            <p className="text-blue-500 text-sm sm:text-base">
              {requests.length} Friend Requests
            </p>
          </div>
          <button
            onClick={() => navigate("/frient_requests/list")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requests.map((friend) => renderFriendCard(friend, "requests"))}
        </div>

        {/* Add Friends Section */}
        <div className="flex items-center justify-between mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mt-6 my-3">
            Add Friends
          </h2>
          <button
            onClick={() => navigate("/frient_requests/add_friends")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suggestions.map((friend) => renderFriendCard(friend, "add"))}
        </div>
      </section>
    </div>
  );
};

export default FriendCardGrid;
