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
import { getNotifications, markNotificationAsRead, friendlist } from "../API/api";

function Notifications() {
  // Local UI State
  const [localNotifications, setLocalNotifications] = useState([]);
  const [friends, setFriends] = useState([]);   // ⭐ NEW — FRIEND LIST STATE
  const [showMenu, setShowMenu] = useState(null);

  // Get userId from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch Notifications
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  // Fetch Friend List ⭐ ADDED
  const { data: friendData } = useQuery({
    queryKey: ["friend-list", userId],
    queryFn: () => friendlist(userId),
    enabled: !!userId,        // only fetch if userId exists
  });

  // Sync fetched Notifications
  useEffect(() => {
    if (!data) return;

    const list = Array.isArray(data) ? data : data.results || [];
    setLocalNotifications(list);
  }, [data]);

  // Sync Friend List ⭐ ADDED
  useEffect(() => {
    if (friendData) {
      setFriends(friendData);     // your API returns array
    }
  }, [friendData]);

  const formatRelativeTime = (value) => {
    if (!value) return "";

    const now = new Date();
    const past = new Date(value);
    const diff = (now - past) / 1000;

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    if (diff < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (days < 7) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return past.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      });
    }
  };

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

  const handleActionClick = (notificationId, type) => {
    console.log("Clicked:", { notificationId, type });
  };

  const handleMenuToggle = (id) => {
    setShowMenu(showMenu === id ? null : id);
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id)
      .then(() => {
        setLocalNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setShowMenu(null);
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  const handleDelete = (id) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    setShowMenu(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-6">
      <div className="my-7">
        <Navbar />
      </div>

      <div className="min-h-[calc(100vh-100px)] px-4 sm:px-6 lg:px-8">
        <div className="2xl:px-44 xl:px-36 lg:px-28 md:px-20 sm:px-14 px-8">

          {/* FRIEND COUNT DISPLAY ⭐ OPTIONAL */}
          <div className="mb-4 text-gray-700 text-sm">
            <b>Friends:</b> {friends?.length || 0}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Notifications
          </h1>

          {isLoading && <p className="text-gray-600">Loading...</p>}

          <div className="space-y-3">
            {localNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-50 rounded-lg shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:shadow-md transition-shadow ${
                  !notification.isRead ? "border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        notification.sender?.profile_image ||
                        "/placeholder.svg"
                      }
                      alt=""
                    />

                    <div>
                      <div className="text-sm sm:text-base text-gray-900">
                        <span className="font-bold">
                          {notification.sender?.profile_name}
                        </span>{" "}
                        <span className="pl-1">{notification.message}</span>
                      </div>

                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    {getNotificationIcon(notification.sender?.notification_type)}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => handleMenuToggle(notification.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
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
