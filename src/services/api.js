import axios from "axios";

const API = axios.create({
  baseURL: "https://edusyncbackend5011-b9gshjc8auajdxat.centralindia-01.azurewebsites.net/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
