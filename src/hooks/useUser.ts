import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userApi } from "@/api/user.api"
import { UpdateProfileRequest } from "@/data/user/user.types"

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await userApi.getProfile()
      return res.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
    }
  })
}
