import { JOB } from "@/types/jobs";
import { apiRequest } from ".";
import { exceptionHandler } from "./exception-handler";
import {
  ListResponse,
  PostResponse,
  SuccessResponse,
  ListApiResponse,
  ScrollApiResponse,
  DetailApiResponse,
} from "@/interface";
import {
  JobPayload,
  JobsRequest,
  PartTimePayload,
  ReligionPayload,
} from "@/interface/jobs";

/* 채용 스크롤 리스트 조회 */
export const getInfiniteJobs = async (
  request: JobsRequest
): Promise<ScrollApiResponse<JOB, "jobs">> => {
  const response = await getJobs(request);
  return {
    jobs: response.jobs,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.jobs.length < request.size,
    totalCount: response.totalCount ?? 0,
  };
};

/* 채용 리스트 조회 */
export const getJobs = async (
  request: JobsRequest
): Promise<ListResponse<JOB, "jobs">> => {
  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(request)) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key + "[]", v));
      } else if (value) {
        params.append(key, value);
      }
    }
    const response = await apiRequest.get<ListApiResponse<JOB, "jobs">>(
      "/jobs",
      {
        params,
      }
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobs error"));
  }
};

/* 채용 상세 조회 */
export const getJob = async (id: number): Promise<JOB> => {
  try {
    const response = await apiRequest.get<DetailApiResponse<JOB>>(
      `/jobs/${id}`
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJob error"));
  }
};

/* 채용 삭제 */
export const deleteJob = async (id: number): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.delete<SuccessResponse>(`/jobs`, id);
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API deleteJob error"));
  }
};

/* 오브리 생성 */
export const createPartTimeJob = async (
  payload: PartTimePayload
): Promise<PostResponse> => {
  try {
    const response = await apiRequest.post<PostResponse>(
      `/jobs/part-time`,
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createPartTimeJob error"));
  }
};

/* 예술단체 or 강사생성 */
export const createFullTimeJob = async (
  job: JobPayload
): Promise<PostResponse> => {
  try {
    const response = await apiRequest.post<PostResponse>(
      `/jobs/full-time`,
      job
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createFullTimeJob error"));
  }
};

/* 종교 채용 생성 */
export const createReligionJob = async (
  payload: ReligionPayload
): Promise<PostResponse> => {
  try {
    const response = await apiRequest.post<PostResponse>(
      `/jobs/religion`,
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createReligionJob error"));
  }
};

/* 예술단체 or 강사 수정 */
export const updateArtOrganization = async (
  jobId: number,
  payload: JobPayload
): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.put<SuccessResponse>(
      `/jobs/art-organization/${jobId}`,
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateArtOrganization error"));
  }
};

/* 종교 채용 수정 */
export const updateReligion = async (
  jobId: number,
  payload: ReligionPayload
): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.put<SuccessResponse>(
      `/jobs/religion/${jobId}`,
      payload
    );
    return response;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateReligion error"));
  }
};

export const getJobsCount = async (): Promise<{ totalCount: number }> => {
  try {
    const response = await apiRequest.get<
      DetailApiResponse<{ totalCount: number }>
    >("/jobs/count");
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobsCount error"));
  }
};
