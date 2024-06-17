import { LESSON } from "@/types/lessons";
import { apiRequest } from ".";
import { exceptionHandler } from "./exception-handler";
import { LessonsRequest } from "@/interface/lessons";
import {
  DetailApiResponse,
  ListApiResponse,
  ListResponse,
  ScrollApiResponse,
  SuccessResponse,
} from "@/interface";

export const getLesson = async (id: number): Promise<LESSON> => {
  try {
    const response = await apiRequest.get<DetailApiResponse<LESSON>>(
      `/lessons/${id}`
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getLesson error"));
  }
};

export const getLessons = async (
  request: LessonsRequest
): Promise<ListResponse<LESSON, "lessons">> => {
  try {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(request)) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key + "[]", v));
      } else if (value) {
        params.append(key, value);
      }
    }
    const response = await apiRequest.get<ListApiResponse<LESSON, "lessons">>(
      "/lessons",
      {
        params,
      }
    );
    return response.item;
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobs error"));
  }
};

export const getInfiniteLessons = async (
  request: LessonsRequest
): Promise<ScrollApiResponse<LESSON, "lessons">> => {
  const response = await getLessons(request);
  return {
    lessons: response.lessons,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.lessons.length < request.size,
    totalCount: response.totalCount ?? 0,
  };
};

export const getLessonQualification = async (): Promise<SuccessResponse> => {
  try {
    const response = await apiRequest.get<SuccessResponse>(
      "/lessons/qualification"
    );
    return response;
  } catch (error) {
    throw new Error(
      exceptionHandler(error, "API getLessonQualification error")
    );
  }
};
