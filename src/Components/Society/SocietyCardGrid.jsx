"use client";

import React, { useState } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import CreateSocietyForm from "./CreateSocietyForm";
import { useQuery } from "@tanstack/react-query";
import { getmySocieties, getOtherSocieties, getsocietyjoinData } from "../../API/api";
// import { getOtherSocieties, getMySocieties } from "../../API/api";

// Convert ISO → "X hours ago"
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now - past) / 1000;

  const min = Math.floor(diff / 60);
  const hr = Math.floor(diff / 3600);
  const day = Math.floor(diff / 86400);

  if (diff < 60) return "Just now";
  if (min < 60) return `${min} minutes`;
  if (hr < 24) return `${hr} hours`;
  return `${day} days`;
};

const SocietyCardGrid = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch "Your Societies"
  const { data: mySocieties, isLoading: loadingMy } = useQuery({
    queryKey: ["my_societies"],
    queryFn: getmySocieties,
  });


  const {data:otherSocieties, isLoading:Loadingothers} = useQuery({
    queryKey:["othersociety"],
    queryFn:getsocietyjoinData,
  })

  // LEAVE BUTTON FUNCTION
  const handleLeave = (e, id) => {
    e.stopPropagation(); // Prevent card click navigation
    console.log("Leaving society:", id);
  };

  // VIEW BUTTON FUNCTION
  const handleView = (e, id) => {
    e.stopPropagation();
    navigate(`/society/${id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="py-7">
        <Navbar />
      </section>

      <section className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8 mt-2">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Society</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-[#3B82F6] border border-[#3B82F6] px-4 py-2 rounded hover:bg-blue-600 hover:text-white font-semibold"
          >
            <FaPlus /> Create New Society
          </button>
        </div>

        <CreateSocietyForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* YOUR SOCIETIES */}
        <div className="flex items-center justify-between mt-5">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Your Societies</h2>
          <p
            onClick={() => navigate("/society/my_society_list")}
            className="text-[#3B82F6] font-semibold cursor-pointer"
            data={mySocieties}
          >
            See All 

            
          </p>
        </div>

        {loadingMy && <p>Loading your societies...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mySocieties?.results?.slice(0,4).map((society) => (
            <div
              key={society.id}
              onClick={() => navigate(`/society/${society.id}`)}
              className="bg-gray-50 rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:scale-103 transition-transform cursor-pointer"
            >
              <img
                src={
                  society.cover_picture ||
                  society.cover_image ||
                  society.creator?.profile_image ||
                  "/placeholder.svg"
                }
                alt={society.name}
                className="w-24 h-24 mb-2 object-cover rounded-full"
              />

              <h3 className="text-lg sm:text-xl font-semibold">
                {society.name}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base">
                Last Active {formatRelativeTime(society.updated_at)} ago
              </p>

              {/* VIEW + LEAVE BUTTONS */}
              <div className="flex justify-between gap-2 mt-3">
                <button
                  onClick={(e) => handleLeave(e, society.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Leave
                </button>

                <button
                  onClick={(e) => handleView(e, society.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* JOIN SOCIETIES */}
        <div className="flex items-center justify-between mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Join Societies</h2>
          <p
            onClick={() => navigate("/society/join_society_list")}
            className="text-[#3B82F6] font-semibold cursor-pointer"
          >
            See All
          </p>
        </div>

        {Loadingothers && <p>Loading societies to join...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherSocieties?.results?.slice(0,4).map((society) => (
            <div
              key={society.id}
              onClick={() => navigate(`/society/${society.id}`)}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center
                      text-center hover:scale-103 transition-transform cursor-pointer"
            >
              <img
                src={
                  society.cover_picture ||
                  society.cover_image ||
                  society.creator?.profile_image ||
                  "/placeholder.svg"
                }
                alt={society.name}
                className="w-24 h-24 mb-2 object-cover rounded-full"
              />

              <h3 className="text-lg sm:text-xl font-semibold">{society.name}</h3>

              <p className="text-gray-600 text-sm sm:text-base">
                Last Active {formatRelativeTime(society.updated_at)} ago
              </p>

              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                Join
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SocietyCardGrid;
