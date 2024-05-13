import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import type {
  CreateTargettedCampaignPayload,
  CreateTargettedCampaignResponse,
  EditTargettedCampaignPayload,
  EditTargettedCampaignResponse,
  GetAffiliateSummaryPayload,
  GetAffiliateSummaryResponses,
  GetListAffiliatorPayload,
  GetListAffiliatorResponses,
  GetSingleTargettedCampaignPayload,
  GetSingleTargettedCampaignResponses,
  GetTargettedCampaignPayload,
  GetTargettedCampaignResponses,
  ManualEnrollmentTransactionAffiliatePayload,
  ShopCampaign,
  UpdateShopCampaignPayload,
} from "../../services/affiliate"
import {
  createTargettedCampaign,
  editTargettedCampaign,
  getAffiliateSummary,
  getListAffiliator,
  getShopCampaign,
  getSingleTargettedCampaign,
  getTargettedCampaign,
  manualEnrollmentAffiliateTransaction,
  updateShopCampaign,
} from "../../services/affiliate"

export const useGetShopCampaign = (options?: UseQueryOptions<ShopCampaign>) => {
  return useQuery({
    queryFn: getShopCampaign,
    ...options,
  })
}

export const useAdminUpdateShopCampaign = (
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

export const useGetSingleTargettedCampaign = (
  payload: GetSingleTargettedCampaignPayload,
  options?: UseQueryOptions<GetSingleTargettedCampaignResponses>
) => {
  return useQuery({
    queryKey: ["targettedCampaign", JSON.stringify(payload)],
    queryFn: async () => getSingleTargettedCampaign(payload),
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

export const useAdminCreateTargettedCampaign = (
  options?: UseMutationOptions<
    CreateTargettedCampaignResponse,
    unknown,
    CreateTargettedCampaignPayload
  >
) => {
  return useMutation(
    async (payload) => createTargettedCampaign(payload),
    options
  )
}

export const useAdminEditTargettedCampaign = (
  options?: UseMutationOptions<
    EditTargettedCampaignResponse,
    unknown,
    EditTargettedCampaignPayload
  >
) => {
  return useMutation(async (payload) => editTargettedCampaign(payload), options)
}

export const useManualEnrollmentAffiliateTransaction = (
  options?: UseMutationOptions<
    null,
    unknown,
    ManualEnrollmentTransactionAffiliatePayload
  >
) => {
  return useMutation(
    async (payload) => manualEnrollmentAffiliateTransaction(payload),
    options
  )
}

export const useGetAffiliateSummary = (
  payload: GetAffiliateSummaryPayload,
  options?: UseQueryOptions<GetAffiliateSummaryResponses>
) => {
  return useQuery({
    queryKey: ["affiliatorSummary", JSON.stringify(payload)],
    queryFn: async () => getAffiliateSummary(payload),
    ...options,
  })
}
