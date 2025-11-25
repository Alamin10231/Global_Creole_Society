import React from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, suggessionfriend } from "../../API/api";

// Helper to normalize different possible API shapes
const normalizeList = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.results)) return raw.results;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.data?.results)) return raw.data.results;
  return [];
};

const FriendCardGrid = () => {
  const navigate = useNavigate();

  // Friend requests query
  const {
    data: friendRequests,
    isLoading: loadingReq,
    isError: errorReq,
    error: friendReqError,
  } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  // Friend suggestions query
  const {
    data: addFriends,
    isLoading: loadingAdd,
    isError: errorAdd,
    error: addFriendsError,
  } = useQuery({
    queryKey: ["addFriends"],
    queryFn: suggessionfriend,
  });

  // Normalize API shapes
  const requests = normalizeList(friendRequests);
  const suggestions = normalizeList(addFriends);

  // Debug logs – open DevTools → Console to see real data
  React.useEffect(() => {
    if (!loadingReq) {
      console.log("Friend requests RAW:", friendRequests);
      console.log("Friend requests NORMALIZED:", requests);
    }
  }, [loadingReq, friendRequests, requests]);

  React.useEffect(() => {
    if (!loadingAdd) {
      console.log("Friend suggestions RAW:", addFriends);
      console.log("Friend suggestions NORMALIZED:", suggestions);
    }
  }, [loadingAdd, addFriends, suggestions]);

  // Render single friend card
  const renderFriendCard = (friend, type) => {
    const key =
      friend?.id ?? friend?.user_id ?? friend?.user?.id ?? Math.random();

    const avatar =
      friend?.profile_image ||
      friend?.avatar ||
      friend?.user?.profile_image ||
      friend?.user?.avatar ||
      "/placeholder.svg";

    const name =
      friend?.profile_name ||
      friend?.name ||
      friend?.full_name ||
      friend?.user?.name ||
      friend?.user?.username ||
      "Unknown User";

    const description =
      friend?.description ||
      friend?.bio ||
      friend?.about ||
      friend?.status ||
      "No bio available";

    return (
      <div
        key={key}
        className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center"
      >
        <div className="flex justify-between items-start gap-5 w-full">
          <img
            src={avatar}
            alt={name}
            className="w-18 h-18 rounded-full mb-2"
          />
          <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">
            Follow
          </p>
        </div>

        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{description}</p>

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
  };

  if (loadingReq || loadingAdd) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (errorReq || errorAdd) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load data{" "}
        {friendReqError?.message ? `Requests: ${friendReqError.message} ` : ""}
        {addFriendsError?.message ? `Suggestions: ${addFriendsError.message}` : ""}
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-7">
        <Navbar />
      </div>

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
        {/* Friend Requests */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold my-2">
              Friend Requests
            </h1>
            <p className="text-blue-500 text-sm sm:text-base">
              {requests.length} Friend Request
              {requests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/frient_requests/list")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-gray-600 mb-4">No pending friend requests.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {requests.map((friend) => renderFriendCard(friend, "requests"))}
          </div>
        )}

        {/* Friend Suggestions */}
        <div className="flex items-center justify-between mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold mt-6 my-3">
            Add Friends
          </h2>
          <p className="text-blue-500 text-sm sm:text-base">
            {suggestions.length} Friend Suggestion
            {suggestions.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => navigate("/frient_requests/add_friends")}
            className="text-blue-500 cursor-pointer px-4 py-2 rounded font-semibold"
          >
            See All
          </button>
        </div>

        {suggestions.length === 0 ? (
          <p className="text-gray-600 mt-2">
            No friend suggestions available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestions.map((friend) => renderFriendCard(friend, "add"))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FriendCardGrid;
