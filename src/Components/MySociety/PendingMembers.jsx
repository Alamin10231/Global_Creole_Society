"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RiMenuAddLine } from "react-icons/ri";
import Navbar from "../Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { getpendingsocietymembers } from "../../API/api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

function PendingMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // ✔ Correct extraction
  const { id } = useParams();

  // ✔ Fetch actual API data
  const { data: pendingMembers, isLoading } = useQuery({
    queryKey: ["pendingMembers", id],
    queryFn: () => getpendingsocietymembers(id),
    enabled: !!id,
  });

  const filteredMembers = pendingMembers?.results?.filter((m) =>
    m.user.profile_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="bg-white shadow-sm px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="search"
              placeholder="Search pending members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <RiMenuAddLine
            onClick={() => setShowMenu((prev) => !prev)}
            size={40}
            className="cursor-pointer p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          />
        </div>

        {/* Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white mt-2 rounded-lg shadow-md p-4"
            >
              <p className="text-gray-600 text-sm">
                ⚙️ Future actions: Sort, Filter, Bulk Approve, etc.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="my-6 text-3xl font-bold text-gray-800">
          Pending Members
        </h3>

        {/* Loading */}
        {isLoading && <p>Loading...</p>}

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredMembers?.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg p-4 shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      m.user.profile_image ||
                      "https://ui-avatars.com/api/?name=" + m.user.profile_name
                    }
                    alt={m.user.profile_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {m.user.profile_name}
                    </h3>
                    <p className="text-xs text-gray-500">{m.user.email}</p>
                  </div>
                </div>

                <button
                  className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  Approve
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredMembers?.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No pending members found 😕</p>
          </div>
        )}

        {/* Count */}
        {pendingMembers && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredMembers?.length} of {pendingMembers?.count} pending
            members
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingMembers;
