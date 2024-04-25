export type ShopCampaignAPIResponse = {
  serial: string
  name: string
  started_at: Date
  ended_at: null
  user_target_type: string
  product_target_type: string
  user_targets: any[]
  product_targets: ProductTarget[]
}

export type ProductTarget = {
  reference: string
  amount: number
  type: string
}
