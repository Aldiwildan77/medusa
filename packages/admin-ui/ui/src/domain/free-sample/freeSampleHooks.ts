import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import {
  getFreeSampleDetail,
  GetFreeSampleDetailPayload,
  GetFreeSampleDetailResponse,
  getFreeSampleList,
  GetFreeSampleListPayload,
  GetFreeSampleListResponse,
  saveFreeSampleTrackingNumber,
  SaveFreeSampleTrackingNumberPayload,
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

export const useGetFreeSampleDetail = (
  payload: GetFreeSampleDetailPayload,
  options?: UseQueryOptions<GetFreeSampleDetailResponse>
) => {
  return useQuery({
    queryKey: ["getFreeSampleDetail", JSON.stringify(payload)],
    queryFn: async () => getFreeSampleDetail(payload),
    ...options,
  })
}

export const useSaveFreeSampleTrackingNumber = (
  options?: UseMutationOptions<
    null,
    unknown,
    SaveFreeSampleTrackingNumberPayload
  >
) => {
  return useMutation(
    async (payload) => saveFreeSampleTrackingNumber(payload),
    options
  )
}
