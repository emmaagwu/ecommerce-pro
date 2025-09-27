import { create } from "zustand";
import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: string;
  email: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

// -----------------------
// Helper Functions
// -----------------------
const getPersistedToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const persistToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
  }
};

// -----------------------
// Axios Instance
// -----------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor: attach access token
apiClient.interceptors.request.use((config) => {
  const accessToken = getPersistedToken();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401s with refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry &&
      !originalRequest.url?.includes("/refresh/") &&
      !originalRequest.url?.includes("/logout/") // <--- exclude logout
    ) {
      try {
        (originalRequest as any)._retry = true;
        await useAuthStore.getState().refreshAccessToken();
        const accessToken = getPersistedToken();
        if (originalRequest && accessToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient.request(originalRequest);
        }
      } catch {
        await useAuthStore.getState().logout(); 
      }
    }

    return Promise.reject(error);
  }
);

// -----------------------
// Zustand Store
// -----------------------
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: getPersistedToken(),
  loading: false,

  // -----------------------
  // Login
  // -----------------------
  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const res = await apiClient.post("/api/auth/login/", { email, password });
      const { access, id, email: userEmail, full_name, is_staff, is_superuser } = res.data;

      set({
        accessToken: access,
        user: { id, email: userEmail, full_name, is_staff, is_superuser },
      });
      persistToken(access);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------
  // Register
  // -----------------------
  register: async (email: string, password: string, full_name: string) => {
    set({ loading: true });
    try {
      const res = await apiClient.post("/api/auth/register/", { email, password, full_name });
      const { access, id, email: userEmail, full_name: fullName, is_staff, is_superuser } = res.data;

      set({
        accessToken: access,
        user: { id, email: userEmail, full_name: fullName, is_staff, is_superuser },
      });
      persistToken(access);
    } catch (err) {
      console.error("Register error:", err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------
  // Logout
  // -----------------------
  logout: async () => {
    set({ loading: true });
    try {
      await apiClient.post("/api/auth/logout/", null, { withCredentials: true });
    } catch (err: any) {
      // Ignore backend error; user may already be logged out
      console.warn("Logout request failed (likely expired token). Clearing local state anyway.");
    } finally {
      set({ user: null, accessToken: null });
      persistToken(null);
      set({ loading: false });
    }
  },
  // -----------------------
  // Fetch Current User
  // -----------------------
  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await apiClient.get("/api/auth/me/");
      set({ user: res.data });
    } catch (err) {
      console.error("FetchMe error:", err);
      set({ user: null, accessToken: null });
      persistToken(null);
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------
  // Refresh Access Token
  // -----------------------
  refreshAccessToken: async () => {
    try {
      const res = await apiClient.post("/api/auth/refresh/");
      const { access } = res.data;
      set({ accessToken: access });
      persistToken(access);
    } catch (err) {
      console.error("Refresh token error:", err);
      set({ user: null, accessToken: null });
      persistToken(null);
      throw err;
    }
  },

  // -----------------------
  // Initialize Store (on app load)
  // -----------------------
  initialize: async () => {
    const token = getPersistedToken();
    if (token) {
      set({ accessToken: token });
      try {
        await get().fetchMe();
      } catch {
        set({ accessToken: null, user: null });
        persistToken(null);
      }
    }
  },
}));