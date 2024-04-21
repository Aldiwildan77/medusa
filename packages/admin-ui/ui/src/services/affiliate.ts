// import { AdminAnalyticsConfigRes } from "@medusajs/medusa"
// import axios from "axios"
// import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"

// const AFFILIATE_BASE_URL = "/affiliate"

// const client = axios.create({
//   baseURL: MEDUSA_BACKEND_URL,
//   withCredentials: true,
// })

export type ShopCampaign = {
  commissionRate: string
  type: "percentage" | "fixed"
}

export const getShopCampaign = async (): Promise<ShopCampaign> => {
  // TODO: fetch from API
  // const { data } = await client.get(`${AFFILIATE_BASE_URL}/shop-campaign`)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    commissionRate: "7",
    type: "percentage",
  }
}

export type UpdateShopCampaignPayload = {
  commissionRate: string
}

export const updateShopCampaign = async (
  _payload: UpdateShopCampaignPayload
): Promise<null> => {
  // TODO: update in API
  // const { data } = await client.get(`${AFFILIATE_BASE_URL}/shop-campaign`)

  console.log("updating...")
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return null
}
