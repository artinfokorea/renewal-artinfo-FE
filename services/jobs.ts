import { ApplyJob, JOB } from "@/types/jobs"
import { publicApiRequest, authApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import {
  ListResponse,
  PostResponse,
  SuccessResponse,
  ListApiResponse,
  ScrollApiResponse,
  DetailApiResponse,
  ListRequest,
} from "@/interface"
import {
  JobPayload,
  JobsRequest,
  PartTimeCreatePayload,
  PartTimeJobRequest,
  PartTimePayload,
  PartTimeUpdatePayload,
} from "@/interface/jobs"
import { USER } from "@/types/users"

/* 채용 스크롤 리스트 조회 */
export const getInfiniteJobs = async (
  request: JobsRequest,
): Promise<ScrollApiResponse<JOB, "jobs">> => {
  const response = await getJobs(request)
  return {
    jobs: response.jobs,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.jobs.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

/* 채용 리스트 조회 */
export const getJobs = async (
  request: JobsRequest,
): Promise<ListResponse<JOB, "jobs">> => {
  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(request)) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v.toString()))
      } else if (value) {
        params.append(key, value.toString())
      }
    }

    const response = await publicApiRequest.get<ListApiResponse<JOB, "jobs">>(
      "/jobs",
      {
        params,
      },
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobs error"))
  }
}

/* 단기채용 리스트 조회 */
export const getPartTimeJobs = async (
  request: PartTimeJobRequest,
): Promise<ListResponse<JOB, "jobs">> => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(request)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v.toString()))
    } else if (value) {
      params.append(key, value.toString())
    }
  }
  const response = await publicApiRequest.get<ListApiResponse<JOB, "jobs">>(
    "/jobs/part-time",
    {
      params: request,
    },
  )
  return response.item
}

/* 채용 상세 조회 */
export const getJob = async (id: number): Promise<JOB> => {
  try {
    const response = await publicApiRequest.get<DetailApiResponse<JOB>>(
      `/jobs/${id}`,
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJob error"))
  }
}

/* 채용 삭제 */
export const deleteJob = async (id: number): Promise<SuccessResponse> => {
  const response = await authApiRequest.delete<SuccessResponse>(`/jobs/${id}`)
  return response
}
/* 오브리 생성 */
export const createPartTimeJob = async (
  payload: PartTimeCreatePayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(
    `/jobs/part-time`,
    payload,
  )
  return response
}

/* 예술단체 or 강사생성 */
export const createFullTimeJob = async (
  job: JobPayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(
    `/jobs/full-time`,
    job,
  )
  return response
}

/* 예술단체 or 강사수정 */
export const updateArtOrganization = async (
  jobId: number,
  payload: PartTimePayload,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.put<SuccessResponse>(
    `/jobs/full-time/${jobId}`,
    payload,
  )
  return response
}

/* 단기직 채용 수정 */
export const updatePartTimeJob = async (
  jobId: number,
  payload: PartTimeUpdatePayload,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.put<SuccessResponse>(
    `/jobs/part-time/${jobId}`,
    payload,
  )
  return response
}

/* 채용 총 갯수 조회 */
export const getJobsCount = async (): Promise<{ totalCount: number }> => {
  try {
    const response =
      await publicApiRequest.get<DetailApiResponse<{ totalCount: number }>>(
        "/jobs/count",
      )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobsCount error"))
  }
}

/* 내 활동 조회 */
export const getMyActivities = async (
  params: ListRequest,
): Promise<ListResponse<JOB, "jobs">> => {
  const response = await authApiRequest.get<ListApiResponse<JOB, "jobs">>(
    "/jobs/my/part-time",
    {
      params,
    },
  )
  return response.item
}

/* 연주 지원자 조회 */
export const getJobApplicants = async (
  jobId: number,
): Promise<ListResponse<USER, "applicants">> => {
  const response = await authApiRequest.get<
    ListApiResponse<USER, "applicants">
  >(`/jobs/part-time/${jobId}/applicants`)
  return response.item
}

/* 나의 지원 목록 조회 */
export const getMyApllyList = async (
  params: ListRequest,
): Promise<ListResponse<ApplyJob, "jobs">> => {
  const response = await authApiRequest.get<ListApiResponse<ApplyJob, "jobs">>(
    `/jobs/my/apply`,
    {
      params,
    },
  )
  return response.item
}

/* 연주 상태 수정 */
export const updateJobStatus = async (
  jobId: number,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.get<SuccessResponse>(
    `/jobs/${jobId}/status`,
  )
  return response
}
