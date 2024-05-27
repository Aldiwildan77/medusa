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

export type PricingGroup = {
  id: string
  name: string
  limit_purchase_quantity: number
  is_active: boolean
  created_at: Date
  updated_at: Date
  products: Product[]
}

export type Product = {
  id: string
  title: string
  thumbnail: string
  variants: Variant[]
}

export type Variant = {
  id: string
  title: string
  sku: null
  is_main: boolean
  price: Price
  max_quantity: number
  stock: number
}

export type Price = {
  original: number
  current: number
  currency_code: string
}
