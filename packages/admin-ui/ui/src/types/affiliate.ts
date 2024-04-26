export type AffiliateGroups = {
  serial: string
  name: string
  started_at: Date
  ended_at: Date | null
  status: "DRAFT" | "ACTIVE" | "ENDED" | "TERMINATED"
  user_target_type: string
  product_target_type: string
  user_targets: string[]
  product_targets: ProductTarget[]
}

export type ProductTarget = {
  reference: string
  amount: number
  type: string
}

export type AffiliatePagination = {
  total: number
  page: number
  limit: number
  total_pages: number
}
