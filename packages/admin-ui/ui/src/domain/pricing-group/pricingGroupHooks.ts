import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import {
  checkMainProducts,
  CheckMainProductsPayload,
  CheckMainProductsResponse,
  createPricingGroup,
  CreatePricingGroupPayload,
  CreatePricingGroupResponse,
  deletePricingGroup,
  DeletePricingGroupPayload,
  deleteProductPricingGroup,
  DeleteProductPricingGroupPayload,
  getPricingGroupDetail,
  GetPricingGroupDetailPayload,
  GetPricingGroupDetailResponse,
  getPricingGroups,
  GetPricingGroupsPayload,
  GetPricingGroupsResponse,
  updatePricingGroup,
  UpdatePricingGroupPayload,
  upsertProductPricingGroup,
  UpsertProductPricingGroupPayload,
} from "../../services/pricingGroup"

export const useCreatePricingGroup = (
  options?: UseMutationOptions<
    CreatePricingGroupResponse,
    unknown,
    CreatePricingGroupPayload
  >
) => {
  return useMutation(async (payload) => createPricingGroup(payload), options)
}

export const useCheckMainProducts = (
  payload: CheckMainProductsPayload,
  options?: UseQueryOptions<CheckMainProductsResponse>
) => {
  return useQuery({
    queryKey: ["checkMainProducts", JSON.stringify(payload)],
    queryFn: async () => checkMainProducts(payload),
    ...options,
  })
}

export const useGetPricingGroups = (
  payload: GetPricingGroupsPayload,
  options?: UseQueryOptions<GetPricingGroupsResponse>
) => {
  return useQuery({
    queryKey: ["getPricingGroups", JSON.stringify(payload)],
    queryFn: async () => getPricingGroups(payload),
    ...options,
  })
}

export const useDeletePricingGroup = (
  options?: UseMutationOptions<null, unknown, DeletePricingGroupPayload>
) => {
  return useMutation(async (payload) => deletePricingGroup(payload), options)
}

export const useGetPricingGroup = (
  payload: GetPricingGroupDetailPayload,
  options?: UseQueryOptions<GetPricingGroupDetailResponse>
) => {
  return useQuery({
    queryKey: ["getPricingGroup", JSON.stringify(payload)],
    queryFn: async () => getPricingGroupDetail(payload),
    ...options,
  })
}

export const useUpdatePricingGroup = (
  options?: UseMutationOptions<null, unknown, UpdatePricingGroupPayload>
) => {
  return useMutation(async (payload) => updatePricingGroup(payload), options)
}

export const useUpsertProductPricingGroup = (
  options?: UseMutationOptions<null, unknown, UpsertProductPricingGroupPayload>
) => {
  return useMutation(
    async (payload) => upsertProductPricingGroup(payload),
    options
  )
}

export const useDeleteProductPricingGroup = (
  options?: UseMutationOptions<null, unknown, DeleteProductPricingGroupPayload>
) => {
  return useMutation(
    async (payload) => deleteProductPricingGroup(payload),
    options
  )
}
