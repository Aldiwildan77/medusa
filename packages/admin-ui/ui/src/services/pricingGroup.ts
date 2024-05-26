import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"
import medusaRequest from "./request"

const AFFILIATE_BASE_URL = "/admin/pricing-groups"

export type CreatePricingGroupPayload = {
  name: string
  limit_purchase_quantity: number
  products: CreatePricingGroupPayloadProduct[]
}

export type CreatePricingGroupPayloadProduct = {
  product_id: string
  product_variant_id: string
  price: number
  max_quantity: number
  is_main: boolean
}

export type CreatePricingGroupResponse = {
  id: string
}

export const createPricingGroup = async (
  payload: CreatePricingGroupPayload
): Promise<CreatePricingGroupResponse> => {
  const res = await medusaRequest(
    "POST",
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}`,
    payload
  )

  return res.data
}

export type CheckMainProductsPayload = {
  product_ids: string[]
}

export type CheckMainProductsResponse = Record<string, boolean>

export const checkMainProducts = async (
  payload: CheckMainProductsPayload
): Promise<CheckMainProductsResponse> => {
  const url = `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/products/check`
  const res = await medusaRequest("POST", url, payload)

  return res.data
}
