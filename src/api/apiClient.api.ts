import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
})

// Request interceptor to automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      console.log("Failed to retrieve auth token:", e)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let refreshPromise: Promise<unknown> | null = null

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) throw error

    const status = error.response.status

    if (status !== 401) throw error

    if (originalRequest.url.includes("/auth/refresh")) {
      throw error
    }

    if (originalRequest._retry) {
      throw error
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient.post("/auth/refresh")
      }

      await refreshPromise
      refreshPromise = null

      return await apiClient(originalRequest)

    } catch (err) {
      refreshPromise = null
      throw err
    }
  }
)