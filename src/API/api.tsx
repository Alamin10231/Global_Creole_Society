import axios from "axios";

const API = axios.create({
  baseURL: "https://mahamudh474.pythonanywhere.com/",
});

// Attach token for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH APIS
// export const signin = (formData: any) => {
//   // Remove any old token BEFORE login request
//   localStorage.removeItem("accessToken");

//   const data = new FormData();
//   data.append("email", formData.email);
//   data.append("password", formData.password");

//   return API.post("/api/accounts/login/", data);
// };
export const signup = (formData: any) => {
  // Remove any old token BEFORE login request
  try {
    localStorage.removeItem("accessToken");
  } catch (e) {}
  return API.post("/api/accounts/register/", formData);
};
export const signin = (formData: any) => {
  // Remove any old token BEFORE login request
  try {
    localStorage.removeItem("accessToken");
  } catch (e) {}

  // Accept either a FormData instance (e.g. when uploading) or a plain
  // object like { email, password } — convert plain object to FormData
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
    // Attempt to extract common token fields and persist in localStorage.
    // Adjust these names if your backend returns a different shape.
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

export const createpost = (formData: any) =>
  API.post("/api/social/posts/create/", formData).then((res) => res.data);

// Get single post by id
export const getFriendRequests = async () => {
  const res = await API.get("/api/friends/requests/"); // your backend URL here
  return res.data;
};

export const getAddFriends = async () => {
  const res = await API.get("/api/friends/suggestions/"); // your backend URL here
  return res.data;
};
export const requestFriend = (userId: string | number) =>
  API.post(`/api/friends/request/${userId}/`).then((res) => res.data);
export const suggessionfriend = async () => {
  const res = await API.get("/api/social/friends/suggestions/");
  return res.data;
};

// notifications
export const getNotifications = async () => {
  return API.get("/api/social/notifications/").then((res) => res.data);
};

export default API;
