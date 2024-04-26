import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import type {
  GetTargettedCampaignPayload,
  GetTargettedCampaignResponses,
  ShopCampaign,
  UpdateShopCampaignPayload,
} from "../../services/affiliate"
import {
  getShopCampaign,
  getTargettedCampaign,
  updateShopCampaign,
} from "../../services/affiliate"

export const useGetShopCampaign = (options?: UseQueryOptions<ShopCampaign>) => {
  return useQuery({
    queryFn: getShopCampaign,
    ...options,
  })
}

export const useAdminUpdateAnalyticsConfig = (
  options?: UseMutationOptions<null, unknown, UpdateShopCampaignPayload>
) => {
  return useMutation(async (payload) => updateShopCampaign(payload), options)
}

export const useGetTargettedCampaign = (
  payload: GetTargettedCampaignPayload,
  options?: UseQueryOptions<GetTargettedCampaignResponses>
) => {
  return useQuery({
    queryKey: ["targettedCampaign", JSON.stringify(payload)],
    queryFn: async () => getTargettedCampaign(payload),
    ...options,
  })
}
