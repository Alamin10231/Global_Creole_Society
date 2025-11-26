"use client";

import { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaComment,
  FaHeart,
  FaEllipsisH,
  FaTrash,
  FaEye,
  FaBell,
} from "react-icons/fa";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../API/api";

function Notifications() {
  // Local UI State
  const [localNotifications, setLocalNotifications] = useState([]);
  const [showMenu, setShowMenu] = useState(null);

  // Fetch Notifications from API
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  // Sync fetched data to local state
  useEffect(() => {
    if (!data) return;

    // Support both array and paginated (results) API structures
    const list = Array.isArray(data) ? data : data.results || [];
    setLocalNotifications(list);
  }, [data]);

  // Return icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "friend_request":
        return <FaUserPlus className="text-blue-500 text-lg" />;
      case "comment":
        return <FaComment className="text-green-500 text-lg" />;
      case "like":
        return <FaHeart className="text-red-500 text-lg" />;
      default:
        return <FaBell className="text-gray-500 text-lg" />;
    }
  };

  // Handle Right Side Action Click
  const handleActionClick = (notificationId, type) => {
    console.log("Clicked:", { notificationId, type });
  };

  // Toggle dropdown menu
  const handleMenuToggle = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  // Mark notification as read
  const handleMarkAsRead = (id) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setShowMenu(null);
  };

  // Delete notification locally
  const handleDelete = (id) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    setShowMenu(null);
  };

  // Click notification body
  const handleNotificationClick = (notification) => {
    console.log("Go to page:", notification);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-6">
      <div className="my-7">
        <Navbar />
      </div>

      <div className="min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8">
        <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Notifications
          </h1>

          {/* Loading */}
          {isLoading && <p className="text-gray-600">Loading...</p>}

          {/* Notification List */}
          <div className="space-y-3">
            {localNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-50 rounded-lg shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-blue-500" : ""
                }`}
              >
                {/* Content */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <p className="text-sm sm:text-base text-gray-900">
                    <span className="font-semibold">
                      {notification.sender?.profile_name}
                    </span>{" "}
                    {notification.sender?.notification_type}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {notification.timestamp}
                  </p>
                </div>

                {/* Right-side Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Icon */}
                  <button
                    onClick={() =>
                      handleActionClick(
                        notification.id,
                        notification.sender?.notification_type
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {getNotificationIcon(
                      notification.sender?.notification_type
                    )}
                  </button>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={() => handleMenuToggle(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FaEllipsisH className="text-gray-500 text-lg" />
                    </button>

                    {showMenu === notification.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-20">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <FaEye className="text-gray-500" />
                          Mark as read
                        </button>

                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <FaTrash className="text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {localNotifications.length === 0 && !isLoading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaBell className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
