// frontend gemini/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  // পরিবর্তন: সরাসরি URL এর বদলে Proxy পাথ ব্যবহার করা হলো
  // এর ফলে request যাবে: localhost:3000/api/... -> localhost:8000/api/v1/...
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // পরিবর্তন: ব্রাউজার এনভায়রনমেন্ট চেক করা ভালো, তবে Next.js এ সাধারণত সমস্যা হয় না
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;