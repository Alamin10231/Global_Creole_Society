    "use client";

    import React from "react";
    import Navbar from "../Navbar";
    import { useMutation, useQuery } from "@tanstack/react-query";
    import { getFriendSuggessions, sendFriendRequest } from "../../API/api";

    const AddFriendList = () => {
    // Fetch friend suggestions
    const { data: addFriendData, isLoading } = useQuery({
        queryKey: ["add-friends"],
        queryFn: getFriendSuggessions,
    });

    // Logged-in user ID
    const loggedInUserId = localStorage.getItem("userId");

    // Mutation for sending friend request
    const addFriendMutation = useMutation({
        mutationFn: (friendId) => sendFriendRequest(friendId),
        onSuccess: () => {
        alert("Friend Request Sent!");
        },
        onError: () => {
        alert("Something went wrong!");
        },
    });

    if (isLoading) return <p className="text-center mt-10">Loading friends...</p>;

    // Filter out logged-in user
    const friendsToShow = (addFriendData || []).filter(
        (friend) => friend.id !== loggedInUserId
    );

    return (
        <div className="bg-gray-100 min-h-screen">
        <Navbar />

        <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8 py-7">
            <h1 className="text-2xl sm:text-3xl font-bold my-3">Add Friends</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friendsToShow.map((friend) => {
                const userName = friend.profile_name || "Unknown";
                const userImage =
                friend.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                return (
                <div
                    key={friend.id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
                >
                    <div className="flex justify-between items-start gap-5 w-full">
                    <img
                        src={userImage}
                        alt={userName}
                        className="w-20 h-20 rounded-full mb-2 object-cover"
                    />
                    <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">
                        Follow
                    </p>
                    </div>

                    <h3 className="text-lg sm:text-xl font-semibold">{userName}</h3>

                    <p className="text-gray-600 text-sm sm:text-base capitalize">
                    Status: {friend.status || "N/A"}
                    </p>

                    <button
                    className="bg-blue-500 text-white mt-3 px-4 py-2 rounded hover:bg-blue-600 w-full"
                    onClick={() => addFriendMutation.mutate(friend.id)}
                    >
                    Add Friend
                    </button>
                </div>
                );
            })}
            </div>
        </div>
        </div>
    );
    };

    export default AddFriendList;
