import axios from "axios";

// Deliberately separate from axiosClient.js — platform admins are a
// different identity from CRM owners/team members, so they get their own
// token key ("kf_admin_token") and their own interceptors. This lets someone
// be logged into a workspace AND the admin console in the same browser
// without either token clobbering the other.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const adminAxiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

adminAxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("kf_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("kf_admin_token");
    }
    return Promise.reject(error);
  }
);

export default adminAxiosClient;
