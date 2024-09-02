import { JOB } from "@/types/jobs"
import { publicApiRequest, authApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import {
  ListResponse,
  PostResponse,
  SuccessResponse,
  ListApiResponse,
  ScrollApiResponse,
  DetailApiResponse,
} from "@/interface"
import { JobPayload, JobsRequest, PartTimePayload } from "@/interface/jobs"
import { PERFORMANCE, PERFORMANCE_DETAIL } from "@/types/performances"
import {
  PerformancePayload,
  PerformancesRequest,
} from "@/interface/performances"

/* 공연 스크롤 리스트 조회 */
export const getInfinitePerformances = async (
  request: PerformancesRequest,
): Promise<ScrollApiResponse<PERFORMANCE, "performances">> => {
  const response = await getPerformances(request)
  return {
    performances: response.performances,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.performances.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

/* 공연 리스트 조회 */
export const getPerformances = async (
  request: PerformancesRequest,
): Promise<ListResponse<PERFORMANCE, "performances">> => {
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(request)) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()))
      } else if (value) {
        params.append(key, value.toString())
      }
    }

    const response = await publicApiRequest.get<
      ListApiResponse<PERFORMANCE, "performances">
    >("/performances", {
      params,
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getPerformances error"))
  }
}

/* 공연 상세 조회 */
export const getPerformance = async (
  id: number,
): Promise<PERFORMANCE_DETAIL> => {
  try {
    const response = await publicApiRequest.get<
      DetailApiResponse<PERFORMANCE_DETAIL>
    >(`/performances/${id}`)
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getPerformance error"))
  }
}

/* 공연 삭제 */
export const deletePerformance = async (
  id: number,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.delete<SuccessResponse>(
    `/performances/${id}`,
  )
  return response
}

/* 예술단체 or 강사생성 */
export const createPerformance = async (
  payload: PerformancePayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(
    `/performances`,
    payload,
  )
  return response
}

/* 예술단체 or 강사수정 */
export const updatePerformance = async (
  performanceId: number,
  payload: PerformancePayload,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.put<SuccessResponse>(
    `/performances/${performanceId}`,
    payload,
  )
  return response
}

/* 채용 총 갯수 조회 */
export const getPerformancesCount = async (): Promise<{
  totalCount: number
}> => {
  try {
    const response = await publicApiRequest.get<
      DetailApiResponse<{ totalCount: number }>
    >("/performances/count")
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getPerformancesCount error"))
  }
}
