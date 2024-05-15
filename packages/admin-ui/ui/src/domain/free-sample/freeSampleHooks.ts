import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import {
  getFreeSampleList,
  GetFreeSampleListPayload,
  GetFreeSampleListResponse,
} from "../../services/freeSample"

export const useGetFreeSampleList = (
  payload: GetFreeSampleListPayload,
  options?: UseQueryOptions<GetFreeSampleListResponse>
) => {
  return useQuery({
    queryKey: ["getFreeSampleList", JSON.stringify(payload)],
    queryFn: async () => getFreeSampleList(payload),
    ...options,
  })
}
