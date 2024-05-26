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
