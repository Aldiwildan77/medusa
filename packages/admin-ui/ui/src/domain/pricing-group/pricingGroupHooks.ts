import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import {
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
