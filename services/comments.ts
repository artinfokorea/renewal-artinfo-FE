import { CommentPayload } from "./../interface/comments"
import { DetailApiResponse, SuccessResponse } from "@/interface"
import { authApiRequest, publicApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { COMMENT } from "@/types/comments"

/* 뉴스 댓글 목록 조회 */
export const getNewsComments = async (newsId: number) => {
  try {
    const response = await publicApiRequest.get<DetailApiResponse<COMMENT>>(
      `/comments/news/${newsId}`,
    )
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getNewsComments error"))
  }
}

/* 뉴스 댓글 생성 */
export const createNewsComment = async (CommentPayload: CommentPayload) => {
  try {
    const response = await authApiRequest.post(`/comments`, CommentPayload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createNewsComment error"))
  }
}

/* 뉴스 댓글 수정 */
export const updateNewsComment = async (newsId: number) => {
  try {
    const response = await authApiRequest.put<SuccessResponse>(
      `/comments/${newsId}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateNewsComment error"))
  }
}

/* 뉴스 댓글 삭제 */
export const deleteNewsComment = async (newsId: number) => {
  try {
    const response = await authApiRequest.delete<SuccessResponse>(
      `/comments/${newsId}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API deleteNewsComment error"))
  }
}
