import axios from "axios";

// ✅ Dynamic Base URL Selection
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  "https://project-update-backend-2.vercel.app/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Timeout কিছুটা বাড়িয়ে ৩০ সেকেন্ড করা হয়েছে বড় ডেটার জন্য
  withCredentials: true, // CORS হ্যান্ডল করার জন্য এটি true রাখা ভালো যদি কুকি ব্যবহার করেন
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Request Interceptor (Token injection with fallback)
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // accessToken বা token যেকোনো একটি পেলেই তা হেডার-এ যুক্ত হবে
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("🚀 Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor (Enhanced Error Handling)
API.interceptors.response.use(
  (response) => {
    // সরাসরি ডেটা রিটার্ন করার বদলে ফুল রেসপন্স রাখা হয়েছে যাতে সাকসেস মেসেজ দেখা যায়
    return response;
  },
  (error) => {
    const { response, request } = error;

    if (response) {
      // সার্ভার রেসপন্স দিয়েছে কিন্তু স্ট্যাটাস কোড ২০০-এর বাইরে
      const { status, data } = response;
      
      console.error(`❌ Server Error (${status}):`, data?.message || "Something went wrong");

      // টোকেন এক্সপায়ার হলে সেশন ক্লিয়ার এবং রিডাইরেক্ট
      if (status === 401 || status === 403) {
        console.warn("⚠️ Session expired or Unauthorized. Logging out...");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          // আপনি চাইলে এখানে window.location.href = "/login" দিতে পারেন
        }
      }
    } else if (request) {
      // রিকোয়েস্ট পাঠানো হয়েছে কিন্তু সার্ভার থেকে কোনো রেসপন্স আসেনি (CORS বা সার্ভার ডাউন)
      console.error("❌ Network Error: Backend is not reachable. Check CORS or Server status.");
    } else {
      // রিকোয়েস্ট সেটআপ করার সময় কোনো ভুল হয়েছে
      console.error("❌ API Config Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;