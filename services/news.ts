import {
  DetailApiResponse,
  ListApiResponse,
  ListRequest,
  ListResponse,
  PostResponse,
  ScrollApiResponse,
  SuccessResponse,
} from "@/interface"
import { exceptionHandler } from "./exception-handler"
import { NEWS } from "@/types/news"
import { authApiRequest, publicApiRequest } from "."
import { NewsPayload } from "@/interface/news"

/* 뉴스 리스트 조회 */
export const getNews = async (
  request: ListRequest,
): Promise<ListResponse<NEWS, "news">> => {
  try {
    const response = await publicApiRequest.get<ListApiResponse<NEWS, "news">>(
      "/news",
      {
        params: request,
      },
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getNews error"))
  }
}

/* 뉴스 스크롤 리스트 조회 */
export const getInfiniteNews = async (
  request: ListRequest,
): Promise<ScrollApiResponse<NEWS, "news">> => {
  const response = await getNews(request)
  return {
    news: response.news,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.news.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

/* 뉴스 상세 조회 */
export const getNewsDetail = async (newsId: number): Promise<NEWS> => {
  try {
    const response = await publicApiRequest.get<DetailApiResponse<NEWS>>(
      `/news/${newsId}`,
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getNewsDetail error"))
  }
}

/* 뉴스 생성 */
export const createNews = async (
  payload: NewsPayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.post<PostResponse>(`/news`, payload)
  return response
}

/* 뉴스 수정 */
export const updateNews = async (
  newsId: number,
  payload: NewsPayload,
): Promise<PostResponse> => {
  const response = await authApiRequest.put<PostResponse>(
    `/news/${newsId}`,
    payload,
  )
  return response
}

/* 뉴스 삭제 */
export const deleteNews = async (newsId: number): Promise<SuccessResponse> => {
  const response = await authApiRequest.delete<SuccessResponse>(
    `/news/${newsId}`,
  )
  return response
}

/* 뉴스 총 갯수 조회 */
export const getNewsCount = async (): Promise<{ totalCount: number }> => {
  try {
    const response =
      await publicApiRequest.get<DetailApiResponse<{ totalCount: number }>>(
        "/news/count",
      )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getNewsCount error"))
  }
}
