export type PricingGroupListData = {
  id: string
  created_at: Date
  updated_at: Date
  name: string
  limit_purchase_quantity: number
  is_active: boolean
  highlighted_products: HighlightedProduct[]
}

export type HighlightedProduct = {
  id: string
  title: string
  thumbnail: string
}

export type PricingGroupPagination = {
  total: number
  page: number
  limit: number
  total_pages: number
}
