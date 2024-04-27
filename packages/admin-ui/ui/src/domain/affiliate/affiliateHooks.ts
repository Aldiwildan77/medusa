import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import type {
  GetListAffiliatorPayload,
  GetListAffiliatorResponses,
  GetTargettedCampaignPayload,
  GetTargettedCampaignResponses,
  ShopCampaign,
  UpdateShopCampaignPayload,
} from "../../services/affiliate"
import {
  getListAffiliator,
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

export const useGetAffiliatorList = (
  payload: GetListAffiliatorPayload,
  options?: UseQueryOptions<GetListAffiliatorResponses>
) => {
  return useQuery({
    queryKey: ["affiliatorList", JSON.stringify(payload)],
    queryFn: async () => getListAffiliator(payload),
    ...options,
  })
}
