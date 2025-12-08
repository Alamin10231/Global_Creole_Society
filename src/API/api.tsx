import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.local.VITE_API_BASE_URL,
  // baseURL: "http://10.10.13.99:8001/",
  // baseURL: "https://sisterlike-tastelessly-mike.ngrok-free.dev/",
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // baseURL: "https://mahamudh474.pythonanywhere.com/",
});
// console.log(import.meta.env.VITE_API_BASE_URL);

// Attach token for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (formData: any) => {
  try {
    localStorage.removeItem("accessToken");
  } catch (e) {}
  return API.post("/api/accounts/register/", formData);
};
export const signin = (formData: any) => {
  try {
    localStorage.removeItem("accessToken");
  } catch (e) {}

  let payload: any = formData;
  if (
    !(formData instanceof FormData) &&
    formData &&
    formData.email &&
    formData.password
  ) {
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    payload = data;
  }

  return API.post("/api/accounts/login/", payload).then((res) => {
    const token =
      res.data?.token ||
      res.data?.access ||
      res.data?.key ||
      res.data?.data?.token;
    if (token) {
      try {
        localStorage.setItem("accessToken", token);
      } catch (e) {}
    }
    return res;
  });
};

export const getposts = (formData: any) =>
  API.get("/api/social/posts/", { params: formData }).then((res) => res.data);
export const changepassword = (formData: any) =>
  API.patch("/api/accounts/change-password/", formData);

export const profiletoggle = () => API.post("/api/accounts/profile-lock/");

export const forgetpassword = (formData: any) =>
  API.post("/api/accounts/send-otp/", formData);

// POSTS
export const getpost = (formData: any) =>
  API.get("/api/social/posts/", { params: formData }).then((res) => res.data);
// SHARE  FEED POST
// src/API/api.js
export const feedsharepost = (payload: any) => {
  return API.post("/api/social/posts/share/", payload).then((res) => res.data);
};
// share feed bulspost
export const feedbulsharepost = (payload: any) => {
  return API.post("/api/social/posts/share-bulk/", payload).then(
    (res) => res.data
  );
};

export const createpost = (postData: FormData) => {
  return API.post("/api/social/posts/create/", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data);
};
//like post
export const toggleLike = (postId: string | number) =>
  API.post(`/api/social/posts/${postId}/like/`).then((res) => res.data);
// comment post
export const commentPost = (postId: any, content: any) =>
  API.post(`/api/social/posts/${postId}/comments/`, { content }).then(
    (res) => res.data
  );

// Fetch comments for a specific post
export const seecomments = (postId: string | number) =>
  API.get(`/api/social/posts/${postId}/comments/`).then((res) => res.data);

// post share

export const sharePost = (postId: any) =>
  API.post(`/api/social/posts/${postId}/share/`).then((res) => res.data);
// friends
export const getFriendRequests = async () => {
  const res = await API.get("/api/social/friends/requests"); // your backend URL here
  return res.data;
};
// friend suggessions
export const getFriendSuggessions = async () => {
  const res = await API.get("/api/social/friends/suggestions/"); // your backend URL here
  return res.data;
};

// add friends
export const sendFriendRequest = async (friendId: string) => {
  const res = await API.post("/api/social/friends/request/", {
    receiver_id: friendId,
  });
  return res.data;
};

// add friends
export const addfriends = async () => {
  const res = await API.get("/api/social/friends");
  return res.data;
};

//accept or reject friend request
export const respondToFriendRequest = async (
  requestId: string | number,
  accept: boolean = true
) => {
  try {
    const res = await API.post(
      `/api/social/friends/requests/${requestId}/response/`,
      { accept }
    );
    return res.data;
  } catch (error) {
    console.error("Error responding to friend request:", error);
    throw error;
  }
};

export const getAddFriends = async () => {
  const res = await API.get("/api/friends/suggestions/"); // your backend URL here
  return res.data;
};
export const requestFriend = (userId: string | number) =>
  API.post(`/api/friends/request/${userId}/`).then((res) => res.data);
// export const suggessionfriend = async () => {
//   const res = await API.get("/api/social/friends/suggestions/");
//   return res.data;
// };

// notifications
export const getNotifications = async () => {
  return API.get("/api/social/notifications/").then((res) => res.data);
};
export const markNotificationAsRead = () => {
  return API.post("/api/social/notifications/mark-read/").then(
    (res) => res.data
  );
};

// profile
export const getprofile = () => {
  return API.get(`/api/accounts/profile/`).then((res) => res.data);
};

export const friendlist = () => {
  return API.get(`/api/social/friends/`).then((res) => res.data);
};

// social
export const getOtherSocieties = () => {
  return API.get(`/api/social/societies?exclude_my_societies=true`).then(
    (res) => res.data
  );
};
export const getmySocieties = () => {
  return API.get(`/api/social/societies?my_societies=true`).then(
    (res) => res.data
  );
};

// join society

export const createsociety = (body: any) => {
  return API.post(`/api/social/societies/create/`, body).then(
    (res) => res.data
  );
};
// remove society
export const removesociety = (id: string | number) => {
  return API.delete(`/api/social/societies/${id}/leave/`).then(
    (res) => res.data
  );
};
// join society
export const joinsociety = (id: string | number) => {
  return API.post(`/api/social/societies/${id}/join/`).then((res) => res.data);
};

// Export the configured API instance
export const getsocietyData = (id: string | number) => {
  return API.get(`/api/social/societies/${id}/`).then((res) => res.data);
};

//get join society
export const getsocietyjoinData = () => {
  return API.get("/api/social/societies", {
    params: { available: true },
  }).then((res) => res.data);
};
// pending post card
export const getpendingsocietyData = (id: string | number) => {
  return API.get(`/api/social/societies/${id}/pending-posts/`).then(
    (res) => res.data
  );
};
// post rejct
export const rejectpost = (postId: string | number) => {
  return API.post(
    `/api/social/posts/${postId}/reject/` // ekhanehoito post id dite hobe
  ).then((res) => res.data);
};
//pending members
export const getpendingsocietymembers = (id: string | number) => {
  return API.get(
    `/api/social/societies/${id}/pending-membership-requests/`
  ).then((res) => res.data);
};
// approve post
export const approvepost = (
  societyId: string | number,
  postId: string | number
) => {
  return API.post(
    `/api/social/posts/0ab2058f-3a05-45e3-9b51-1adbbcdc3a76/approve/`
  ).then((res) => res.data);
};

export const approvemember = (
  societyId: string | number,
  memberId: string | number
) => {
  return API.post(
    `/api/social/societies/${societyId}/memberships/${memberId}/approve/`
  ).then((res) => res.data);
};
// /api/social/societies/{society_pk}/memberships/{membership_pk}/approve/
// show memberships
export const getMemberships = (id: string | number) => {
  return API.get(`/api/social/societies/${id}/members/`).then(
    (res) => res.data
  );
};

//single user post
export const getsingleuserpost = (societyId: string | number) => {
  return API.get(`/api/social/posts/?society_id=${societyId}`).then(
    (res) => res.data
  );
};
// see the post
export const seethepost = (societyId: string | number) =>
  API.get(`/api/social/posts/?society_id=${societyId}`).then((res) => res.data);

// --------------------------
// Create a new post
// --------------------------
export const createPost = (postData: FormData) => {
  return API.post("/api/social/posts/create/", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data);
};

// chatlist
export const getchatlist = () => {
  return API.get("/api/chat/conversations/").then((res) => res.data);
};

export const getMessages = (conversationId: any) => {
  return API.get(`/api/chat/conversations/${conversationId}/messages/`).then(
    (res) => res.data
  );
};
// shop product list
export const getproductlist = () => {
  return API.get("/api/shop/products").then((res) => res.data);
};

// create product
export const createproduct = (payload: any) => {
  return API.post("/api/shop/products/", payload).then((res) => res.data);
};

// approve post
export const approvePost = (postId: string | number) => {
  return API.post(`/api/social/posts/${postId}/approve/`).then(
    (res) => res.data
  );
};
// reject post
export const rejectPost = (postId: string | number) => {
  return API.post(`/api/social/posts/${postId}/reject/`).then(
    (res) => res.data
  );
};

export const getPendingPosts = (societyId: string | number) =>
  API.get(`/api/social/societies/${societyId}/pending-posts/`).then(
    (res) => res.data
  );
// story
export const getstories = async () => {
  const res = await API.get("/api/social/stories/");
  return res.data;
};
export const poststories = (payload: any) =>
  API.post("/api/social/stories/create/", payload).then((res) => res.data);
export default API;
export const feedSharePost = async (data: any) => {
  const res = await API.post("/api/social/posts/share/", data);
  return res.data;
};

export const getInboxUsers = async () => {
  const res = await API.get("/api/chat/conversations/");
  return res.data;
};
export const sharePostBulk = async (payload: any) => {
  const res = await API.post("/api/social/posts/share-bulk/", payload);
  return res.data;
};
