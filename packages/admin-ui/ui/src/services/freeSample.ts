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
