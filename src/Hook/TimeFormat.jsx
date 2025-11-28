import React from 'react'

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

export default formatRelativeTime;

export const formatTimestamp = (value) => {
  if (!value) return "";

  try {
    const d = new Date(value);

    // ---- Time Format (8:12PM) ----
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // 0 → 12
    minutes = minutes.toString().padStart(2, "0");

    const time = `${hours}:${minutes}${ampm}`;

    // ---- Date Format (12 April) ----
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" }); // April

    const date = `${day} ${month}`;

    // Final output (you can return what you want)
    return { time, date };
  } catch {
    return value;
  }
};