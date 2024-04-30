import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"
import {
  AffiliateGroups,
  AffiliatePagination,
  Affiliator,
} from "../types/affiliate"

const AFFILIATE_BASE_URL = "/affiliate"

export type ShopCampaign = {
  serial: string
  commissionRate: number
  type: "PERCENTAGE" | "FIXED"
}

export const getShopCampaign = async (): Promise<ShopCampaign> => {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/groups?user_target_type=ALL&product_target_type=ALL&sort_by=ASC&order_by=CREATED_AT&limit=1&page=1`
  ).then(async (res) => res.json())

  const data = res.data[0] as AffiliateGroups
  const shopCampaign = data.product_targets?.find((t) => t.reference === "ALL")

  return {
    serial: data.serial,
    commissionRate: shopCampaign?.amount || 0,
    type: shopCampaign?.type === "PERCENTAGE" ? "PERCENTAGE" : "FIXED",
  }
}

export type UpdateShopCampaignPayload = {
  serial: string
  commissionRate: number
}

export const updateShopCampaign = async (
  payload: UpdateShopCampaignPayload
): Promise<null> => {
  const body = {
    user_target_type: "ALL",
    product_target_type: "ALL",
    product_targets: [
      {
        reference: "ALL",
        amount: payload.commissionRate,
        type: "PERCENTAGE",
      },
    ],
  }

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/group/${payload.serial}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const json = await res.text()
  // throw error if status code is not 200
  if (!res.ok) {
    // throw error from response
    throw new Error(json)
  }

  return null
}

export type GetTargettedCampaignPayload = {
  page: number
  limit: number
}

export type GetTargettedCampaignResponses = {
  data: AffiliateGroups[]
  pagination: AffiliatePagination
}

export const getTargettedCampaign = async (
  payload: GetTargettedCampaignPayload
): Promise<GetTargettedCampaignResponses> => {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/groups?user_target_type=SPECIFIC&sort_by=DESC&order_by=CREATED_AT&limit=${payload.limit}&page=${payload.page}`
  ).then(async (res) => res.json())

  return res as GetTargettedCampaignResponses
}

export type GetListAffiliatorPayload = {
  page: number
  limit: number
  search?: string
  orderBy?: "CREATED_AT" | "NAME" | "TOTAL_COMMISSION"
  sortBy?: "ASC" | "DESC"
}

export type GetListAffiliatorResponses = {
  data: Affiliator[]
  pagination: AffiliatePagination
}

export const getListAffiliator = async (
  payload: GetListAffiliatorPayload
): Promise<GetListAffiliatorResponses> => {
  const url = new URL(`${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/affiliators`)

  if (payload.search) {
    url.searchParams.append("search", payload.search)
  }

  if (payload.orderBy) {
    url.searchParams.append("order_by", payload.orderBy)
  }

  if (payload.sortBy) {
    url.searchParams.append("sort_by", payload.sortBy)
  }

  url.searchParams.append("limit", payload.limit.toString())
  url.searchParams.append("page", payload.page.toString())

  const res = await fetch(url.toString()).then(async (res) => res.json())

  return res as GetListAffiliatorResponses
}

export type CreateTargettedCampaignPayload = Omit<
  AffiliateGroups,
  "serial" | "status"
>

export type CreateTargettedCampaignResponse = {
  data: {
    serial: string
  }
}

export const createTargettedCampaign = async (
  payload: CreateTargettedCampaignPayload
): Promise<CreateTargettedCampaignResponse> => {
  const res = await fetch(`${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/group`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })

  const json = await res.json()
  // throw error if status code is not 200
  if (!res.ok) {
    // throw error from response
    throw new Error(json)
  }

  return json
}
