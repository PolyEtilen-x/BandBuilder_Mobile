import { apiClient } from "./apiClient.api"
import { UserProfileDTO, UpdateProfileRequest } from "@/data/user/user.types"

export const userApi = {
  getProfile: () =>
    apiClient.get<UserProfileDTO>("/user/profile"),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.patch<UserProfileDTO["user"]>("/user/profile", data),

  getAttemptDetail: (attemptId: string) =>
    apiClient.get<any>(`/user/attempts/${attemptId}`),

  getAttemptExplanation: (attemptId: string) =>
    apiClient.post<any>(`/user/attempts/${attemptId}/explain`)
}

