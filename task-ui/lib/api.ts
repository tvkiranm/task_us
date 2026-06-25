"use client";

import axios from "axios";
import { clearAuthSession, getStoredToken } from "@/lib/auth-storage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getStoredToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global response handler: on 401 clear storage and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        clearAuthSession();
        if (typeof window !== "undefined") window.location.href = "/login";
      } catch {
        // ignore
      }
    }
    return Promise.reject(err);
  },
);

export default api;
