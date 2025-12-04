import React from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approvePost } from "../../API/api";

const PendingPostCard = ({ post, onShare, onApproved }) => {
  const queryClient = useQueryClient();

  const { mutate: approve, isLoading } = useMutation({
    mutationFn: () => approvePost(post.id),
    onSuccess: () => {
      toast.success("Post Approved!");
      queryClient.invalidateQueries(["pendingPosts"]);
      if (onApproved) onApproved(post.id);
    },
    onError: () => toast.error("Approval failed"),
  });

  const avatar = post.user?.profile_image || "/placeholder.svg";
  const username = post.user?.profile_name || "Unknown User";

  return (
    <div className="bg-white rounded-xl p-4 shadow mb-4">

      {/* USER HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{username}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <button onClick={onShare} className="p-2 hover:bg-gray-100 rounded-full">
          <FaShareFromSquare className="text-gray-500" />
        </button>
      </div>

      {/* CONTENT */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* IMAGE */}
      {post.media?.length > 0 && (
        <img
          src={post.media[0].file}
          className="w-full rounded-lg mb-3"
          alt=""
        />
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 border-t pt-3">
        <button className="flex-1 py-2 border rounded-lg">Decline</button>

        <button
          onClick={() => approve()}
          disabled={isLoading}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-70"
        >
          {isLoading ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default PendingPostCard;
