export type AffiliateGroups = {
  serial: string
  name: string
  started_at: string
  ended_at: string | null
  status: "DRAFT" | "ACTIVE" | "ENDED" | "TERMINATED"
  user_target_type: "ALL" | "SPECIFIC"
  product_target_type: string
  user_targets: string[]
  product_targets?: ProductTarget[]
}

export type ProductTarget = {
  reference: string
  amount: number
  type: "PERCENTAGE"
}

export type AffiliatePagination = {
  total: number
  page: number
  limit: number
  total_pages: number
}

export type Affiliator = {
  name: string
  customer_id: string
  affiliate_code: string
  total_product_affiliated: number
  social_media: AffiliatorSocialMedia[]
}

export type AffiliatorSocialMedia = {
  platform: string
  username: string
}
