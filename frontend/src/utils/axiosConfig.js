import axios from "axios";
import { serverUrl } from "../App";


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // 🔥 Only attach token to your backend
  if (token && config.url.startsWith(serverUrl)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;
