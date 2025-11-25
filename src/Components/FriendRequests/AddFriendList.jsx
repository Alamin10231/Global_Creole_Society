import React from 'react';
import Navbar from '../Navbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAddFriends, requestFriend } from '../../API/api';

const AddFriendList = () => {
    const queryClient = useQueryClient();

    // Fetch suggestions from backend
    const { data: addFriends = [], isLoading } = useQuery({
        queryKey: ['addFriends'],
        queryFn: () => getAddFriends(),
    });

    // Normalize to array when backend returns { results: [...] }
    const suggestions = Array.isArray(addFriends) ? addFriends : addFriends?.results || [];

    const mutation = useMutation((userId) => requestFriend(userId), {
        onSuccess: () => {
            // Refresh suggestions and friend requests lists
            queryClient.invalidateQueries(['addFriends']);
            queryClient.invalidateQueries(['friendRequests']);
        },
        onError: (err) => {
            console.error('Failed to send friend request', err);
        },
    });

    const handleAddFriend = (id) => {
        mutation.mutate(id);
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold my-3">Add Friend</h1>
                    </div>
                </div>

                {isLoading ? (
                    <p className="text-center mt-6">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {suggestions.map(friend => (
                            <div key={friend.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                                <div className="flex justify-between items-start gap-5 w-full">
                                    <img
                                        src={friend.avatar || friend.profile_image || '/placeholder.svg'}
                                        alt={friend.name || friend.username}
                                        className="w-18 h-18 rounded-full mb-2"
                                    />
                                    <p className="bg-[#FFF9D9] text-[#998100] px-2 py-1 rounded">Follow</p>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold">{friend.name || friend.username}</h3>
                                <p className="text-gray-600 text-sm sm:text-base">{friend.status || friend.bio || ''}</p>
                                <div className="flex flex-wrap justify-center gap-2 mt-3 w-full">
                                    <button
                                        onClick={() => handleAddFriend(friend.id)}
                                        disabled={mutation.isLoading}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                                    >
                                        {mutation.isLoading ? 'Sending...' : 'Add friend'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddFriendList;
