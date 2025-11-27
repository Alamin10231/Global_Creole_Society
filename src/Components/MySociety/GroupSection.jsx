import React from "react";
import { FaUserCircle } from "react-icons/fa";
import MySocietyCoverpicUpload from "./MySocietyCoverpicUpload";
import { getMemberships, getsocietyData } from "../../API/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const GroupSection = () => {
  const { id } = useParams();

  // Fetch society info
  const { data: societyData, isLoading: societyLoading } = useQuery({
    queryKey: ["societyData", id],
    queryFn: () => getsocietyData(id),
    enabled: !!id,
  });

  // Fetch members
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ["societyMembers", id],
    queryFn: () => getMemberships(id),
    enabled: !!id,
  });
  // console.log("naim",membersData.user.profile_image)

  if (societyLoading || membersLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!societyData) {
    return <div className="p-4 text-center">No society data found.</div>;
  }
 const members = membersData?.results || [];
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mx-auto">
      {/* Cover Image Section */}
      <div className="relative">
        <button className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition duration-200">
          Edit Cover
        </button>

        <MySocietyCoverpicUpload />
      </div>

      {/* Profile Row Section */}
      <div className="p-4 flex flex-col items-start">
        <div className="flex items-center justify-between w-full mb-4">
          <span className="text-gray-600 font-medium">
            Members {societyData?.member_count || 0}
          </span>
          <a
            href="#"
            className="text-blue-600 text-sm hover:text-blue-800 hover:underline"
          >
            SEE ALL
          </a>
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {members && members.length > 0 ? (
            members.map((member) => (
              <img
                key={member.id}
                src={member.user.profile_image || ""}
                alt={member.profile_name || "Member"}
                className="w-10 h-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
              />
            ))
          ) : (
            <div className="flex items-center space-x-2">
              <FaUserCircle className="w-10 h-10 text-gray-400" />
              <span className="text-gray-500 text-sm">No members yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSection;
