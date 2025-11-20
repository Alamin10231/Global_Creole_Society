import axios from "axios";

const API = axios.create({
  baseURL: "https://mahamudh474.pythonanywhere.com/",
});

export const signin = (formData: any) =>
  API.post("/api/accounts/login/", formData);
export const signup = (formatData: any) => {
  return API.post("/api/accounts/register/", formatData);
};
export const changepassword = (formData: any) => {
  return API.patch("/api/accounts/change-password/", formData);
};
export const profiletoggle = (name: string) =>
  API.patch("/api/accounts/profile-lock/", { name });