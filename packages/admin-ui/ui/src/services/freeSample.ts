import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"
import { FreeSample, FreeSamplePagination } from "../types/freeSample"

const BASE_URL = "/free-sample"

export type GetFreeSampleListPayload = {
  page: number
  limit: number
}

export type GetFreeSampleListResponse = {
  data: FreeSample[]
  pagination: FreeSamplePagination
}

export const getFreeSampleList = async (
  payload: GetFreeSampleListPayload
): Promise<GetFreeSampleListResponse> => {
  const query = new URLSearchParams({
    limit: String(payload.limit),
    page: String(payload.page),
  })

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${BASE_URL}/admin?${query.toString()}`
  ).then(async (res) => res.json())

  return res
}

export type GetFreeSampleDetailPayload = {
  serial: string
}

export type GetFreeSampleDetailResponse = FreeSample

export const getFreeSampleDetail = async (
  payload: GetFreeSampleDetailPayload
): Promise<GetFreeSampleDetailResponse> => {
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${BASE_URL}/${payload.serial}`
  ).then(async (res) => res.json())

  return res.data
}

export type SaveFreeSampleTrackingNumberPayload = {
  transactionSerial: string
  trackingNumber: string
}

export const saveFreeSampleTrackingNumber = async (
  payload: SaveFreeSampleTrackingNumberPayload
): Promise<null> => {
  const body = {
    transaction_serial: payload.transactionSerial,
    status: "SHIPPED",
    tracking_code: payload.trackingNumber,
  }
  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${BASE_URL}/admin/update-status`,
    {
      method: "POST",
      body: JSON.stringify(body),
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

export type RejectFreeSamplePayload = {
  transactionSerial: string
}

export const rejectFreeSample = async (
  payload: RejectFreeSamplePayload
): Promise<null> => {
  const body = {
    transaction_serial: payload.transactionSerial,
    status: "REJECTED",
  }

  const res = await fetch(
    `${MEDUSA_BACKEND_URL}${BASE_URL}/admin/update-status`,
    {
      method: "POST",
      body: JSON.stringify(body),
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
