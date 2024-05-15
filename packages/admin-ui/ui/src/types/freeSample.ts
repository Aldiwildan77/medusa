export type FreeSample = {
  serial: string
  status: string
  transaction_date: Date
  tracking_code: string
  note: null
  customer: Customer
  shipping: Shipping
  items: Item[]
}

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

type Item = {
  serial: string
  quantity: number
  note: string
  transaction_serial: string
  product_variant: {
    id: string
    thumbnail: string
    title: string
  }
}

type Shipping = {
  id: string
  first_name: string
  last_name: string
  phone: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  country_code: string
  province: string
}

export type FreeSamplePagination = {
  total: number
  page: number
  limit: number
  total_pages: number
}
