import { LESSON } from "@/types/lessons"
import { publicApiRequest, authApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { LessonPayload, LessonsRequest } from "@/interface/lessons"
import {
  DetailApiResponse,
  ListApiResponse,
  ListResponse,
  PostResponse,
  ScrollApiResponse,
  SuccessResponse,
} from "@/interface"

export const getLesson = async (id: number): Promise<LESSON> => {
  try {
    const response = await publicApiRequest.get<DetailApiResponse<LESSON>>(
      `/lessons/${id}`,
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getLesson error"))
  }
}

export const getLessons = async (
  request: LessonsRequest,
): Promise<ListResponse<LESSON, "lessons">> => {
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
      ListApiResponse<LESSON, "lessons">
    >("/lessons", {
      params,
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobs error"))
  }
}

export const getInfiniteLessons = async (
  request: LessonsRequest,
): Promise<ScrollApiResponse<LESSON, "lessons">> => {
  const response = await getLessons(request)
  return {
    lessons: response.lessons,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.lessons.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

export const getLessonQualification = async (): Promise<SuccessResponse> => {
  const response = await authApiRequest.get<SuccessResponse>(
    "/lessons/qualification",
  )
  return response
}

export const getLessonsCount = async (): Promise<{ totalCount: number }> => {
  try {
    const response =
      await publicApiRequest.get<DetailApiResponse<{ totalCount: number }>>(
        "/lessons/count",
      )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getLessonsCount error"))
  }
}

export const createLesson = async (
  payload: LessonPayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(`/lessons`, payload)
  return response
}

export const updateLesson = async (
  payload: LessonPayload,
): Promise<SuccessResponse> => {
  const response = await authApiRequest.put<SuccessResponse>(
    `/lessons`,
    payload,
  )
  return response
}

export const deleteLesson = async (): Promise<SuccessResponse> => {
  const response = await authApiRequest.delete<SuccessResponse>("/lessons")
  return response
}
