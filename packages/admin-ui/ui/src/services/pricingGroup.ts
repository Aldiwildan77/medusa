import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"
import {
  PricingGroup,
  PricingGroupListData,
  PricingGroupPagination,
} from "../types/pricingGroup"
import medusaRequest from "./request"

const BASE_URL = "/admin/pricing-groups"

export type CreatePricingGroupPayload = {
  name: string
  limit_purchase_quantity: number
  is_active: boolean
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
    `${MEDUSA_BACKEND_URL}${BASE_URL}`,
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
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/products/check`
  const res = await medusaRequest("POST", url, payload)

  return res.data
}

export type GetPricingGroupsPayload = {
  page: number
  limit: number
  keyword?: string
}

export type GetPricingGroupsResponse = {
  data: PricingGroupListData[]
  pagination: PricingGroupPagination
}

export const getPricingGroups = async (
  payload: GetPricingGroupsPayload
): Promise<GetPricingGroupsResponse> => {
  const url = new URL(`${MEDUSA_BACKEND_URL}${BASE_URL}`)

  url.searchParams.append("page", payload.page.toString())
  url.searchParams.append("limit", payload.limit.toString())
  url.searchParams.append("option", "with_highlighted_products")

  if (payload?.keyword) {
    url.searchParams.append("keyword", payload.keyword)
  }

  const res = await medusaRequest("GET", url.toString(), payload)

  return res.data
}

export type DeletePricingGroupPayload = {
  id: string
}

export const deletePricingGroup = async (
  payload: DeletePricingGroupPayload
): Promise<null> => {
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/${payload.id}`

  const res = await medusaRequest("DELETE", url, payload)
  return res.data
}

export type GetPricingGroupDetailPayload = {
  id: string
}

export type GetPricingGroupDetailResponse = PricingGroup

export const getPricingGroupDetail = async (
  payload: GetPricingGroupDetailPayload
): Promise<GetPricingGroupDetailResponse> => {
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/${payload.id}`

  const res = await medusaRequest("GET", url, payload)

  return res.data
}

export type UpdatePricingGroupPayload = {
  id: string
  body: {
    name: string
    limit_purchase_quantity: number
    is_active: boolean
  }
}

export const updatePricingGroup = async (
  payload: UpdatePricingGroupPayload
): Promise<null> => {
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/${payload.id}`

  const res = await medusaRequest("PUT", url, payload.body)

  return res.data
}

export type UpsertProductPricingGroupPayload = {
  group_id: string
  products: {
    product_id: string
    product_variant_id: string
    price: number
    max_quantity: number
    is_main: boolean
  }[]
}

export const upsertProductPricingGroup = async (
  payload: UpsertProductPricingGroupPayload
): Promise<null> => {
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/products/upsert`

  const res = await medusaRequest("POST", url, payload)

  return res.data
}

export type DeleteProductPricingGroupPayload = {
  group_id: string
  products: {
    product_id: string
    product_variant_id: string
  }[]
}

export const deleteProductPricingGroup = async (
  payload: DeleteProductPricingGroupPayload
): Promise<null> => {
  const url = `${MEDUSA_BACKEND_URL}${BASE_URL}/products/remove`

  const res = await medusaRequest("DELETE", url, payload)

  return res.data
}
