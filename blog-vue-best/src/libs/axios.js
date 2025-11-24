import axios from "axios";
import { LOCALE_API_URL, API_URL } from "../utils/contants";
// import { useUserStore } from "../store/user";

const baseURL = {
  locale: LOCALE_API_URL,
  live: API_URL,
};

const api = axios.create({
  baseURL: baseURL.live,
});

const token = localStorage.getItem("authToken") ?? "";

console.log("token", token);

api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${token}`,
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  return config;
});

export default api;
