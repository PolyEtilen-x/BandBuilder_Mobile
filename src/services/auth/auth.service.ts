import { apiClient } from "@/api/apiClient.api"

export async function getCurrentUser() {
  try {
    const res = await apiClient.get("/auth/me")
    console.log("👤 getCurrentUser success:", res.data)
    return res.data
  } catch (err: any) {
    console.error("❌ getCurrentUser error:", err?.message || err)
    if (err.response) {
      console.error("❌ Response data:", err.response.data)
      console.error("❌ Response status:", err.response.status)
    }
    return null
  }
}

export async function refreshToken() {
  try {
    await apiClient.post("/auth/refresh")
    return true
  } catch {
    return false  
  }
}