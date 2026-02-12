import axios from "axios";

const moveTutorApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

moveTutorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("@MoveTutor:token");
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default moveTutorApi;