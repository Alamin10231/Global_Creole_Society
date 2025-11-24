// src/API/api.ts
import axios from "axios";
import { form } from "framer-motion/client";


const API = axios.create({
  baseURL: "https://sisterlike-tastelessly-mike.ngrok-free.dev",
  // withCredentials: true,
});

// interceptor to add token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   console.log("Token from localStorage:", token); // Debugging line

//   if (token) {
//     // make sure headers object exists
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`; // or `JWT ${token}` if your Postman uses that
//   }

//   return config;
// });

// Login
export const signin = async (formData: any) => {
  const res = await API.post("/api/accounts/login/", formData);

  // Check what your backend returns (access, token, etc.)
  // const token = res.data.access_token || res.data.token || res.data.access;

  // if (token) {
  //   localStorage.setItem("token", token); // ✅ saved here
  // }

  return res;
};

export const signup = (formatData: any) =>
  API.post("/api/accounts/register/", formatData);

export const changepassword = (formData: any) =>
  API.patch("/api/accounts/change-password/", formData);

export const profiletoggle = () => API.post("/api/accounts/profile-lock/");
export const forgetpassword = (formatData: any) =>
  API.post("/api/accounts/send-otp/", formatData);

export const createpost = (formData: any) =>
  API.post("/api/social/posts/create/", formData);

export const getposts = () => API.get("/api/social/posts/"); 

// profile
export const getprofile = (username: string) =>
  API.get(`/api/accounts/profile/${username}/`);
export default API;
