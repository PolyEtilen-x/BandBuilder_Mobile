import { apiClient } from "./apiClient.api"
import { UserProfileDTO, UpdateProfileRequest } from "@/data/user/user.types"

export const userApi = {
  getProfile: () =>
    apiClient.get<UserProfileDTO>("/user/profile"),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.patch<UserProfileDTO["user"]>("/user/profile", data)
}
