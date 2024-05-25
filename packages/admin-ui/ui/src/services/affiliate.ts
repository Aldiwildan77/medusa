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
  const query = new URLSearchParams({
    user_target_type: "ALL",
    product_target_type: "ALL",
    sort_by: "ASC",
    order_by: "CREATED_AT",
    limit: "1",
    page: "1",
  })
  let res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/groups?${query.toString()}`
  ).then(async (res) => res.json())

  console.log("res.data", res.data)
  if (res.data.length === 0) {
    await createTargettedCampaign({
      name: "Shop Campaign",
      started_at: new Date().toISOString(),
      ended_at: null,
      user_target_type: "ALL",
      product_target_type: "ALL",
      user_targets: [],
      product_targets: [
        {
          reference: "ALL",
          amount: 0,
          type: "PERCENTAGE",
        },
      ],
    })
    res = await fetch(
      `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/groups?${query.toString()}`
    ).then(async (res) => res.json())
  }
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

export type GetSingleTargettedCampaignPayload = {
  serial: string
}

export type GetSingleTargettedCampaignResponses = {
  data: AffiliateGroups
}

export const getSingleTargettedCampaign = async (
  payload: GetSingleTargettedCampaignPayload
): Promise<GetSingleTargettedCampaignResponses> => {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/group?serial=${payload.serial}`
  ).then(async (res) => res.json())

  return res
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
    url.searchParams.append("q", payload.search)
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

export type EditTargettedCampaignPayload = Omit<AffiliateGroups, "status">

export type EditTargettedCampaignResponse = {
  data: {
    serial: string
  }
}

export const editTargettedCampaign = async (
  payload: EditTargettedCampaignPayload
): Promise<EditTargettedCampaignResponse> => {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/group/${payload.serial}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const json = await res.json()
  // throw error if status code is not 200
  if (!res.ok) {
    // throw error from response
    throw new Error(json)
  }

  return json
}

export type ManualEnrollmentTransactionAffiliatePayload = {
  orderId: string
}

export const manualEnrollmentAffiliateTransaction = async (
  payload: ManualEnrollmentTransactionAffiliatePayload
): Promise<null> => {
  await fetch(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/transaction/manual-enroll`,
    {
      method: "POST",
      body: JSON.stringify({
        order_id: payload.orderId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  return null
}

export type GetAffiliateSummaryPayload = {
  startPeriodAt: string
  endPeriodAt: string
}

export type GetAffiliateSummaryResponses = {
  totalProductSold: number
  totalOrders: number
  totalCommission: number
  totalRevenue: number
  totalCustomer: number
  totalAffiliator: number
}

export const getAffiliateSummary = async (
  payload: GetAffiliateSummaryPayload
): Promise<GetAffiliateSummaryResponses> => {
  const url = new URL(`${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/analytics`)

  if (payload.startPeriodAt) {
    url.searchParams.append("start_period_at", payload.startPeriodAt)
  }

  if (payload.endPeriodAt) {
    url.searchParams.append("end_period_at", payload.endPeriodAt)
  }

  const res = await fetch(url.toString()).then(async (res) => res.json())
  const data = res.data
  return {
    totalProductSold: data.total_product_sold,
    totalOrders: data.total_order,
    totalCommission: data.total_commission,
    totalRevenue: data.total_revenue,
    totalCustomer: data.total_customer,
    totalAffiliator: data.total_affiliator,
  }
}

export type GetAffiliatorSummaryPayload = {
  customer_id: string
  startPeriodAt: string
  endPeriodAt: string
}

export type GetAffiliatorSummaryResponses = {
  totalProductSold: number
  totalOrders: number
  totalCommission: number
}

export const getAffiliatorSummary = async (
  payload: GetAffiliatorSummaryPayload
): Promise<GetAffiliatorSummaryResponses> => {
  const url = new URL(
    `${MEDUSA_BACKEND_URL}${AFFILIATE_BASE_URL}/analytics/affiliator/${payload.customer_id}/summary`
  )

  if (payload.startPeriodAt) {
    url.searchParams.append("start_period_at", payload.startPeriodAt)
  }

  if (payload.endPeriodAt) {
    url.searchParams.append("end_period_at", payload.endPeriodAt)
  }

  const res = await fetch(url.toString()).then(async (res) => res.json())
  console.log("res", res)
  const data = res.data
  return {
    totalProductSold: data.total_product_sold,
    totalOrders: data.total_order,
    totalCommission: data.total_commission,
  }
}
