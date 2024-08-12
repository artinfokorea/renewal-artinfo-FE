import { CommentPayload, CommentsRequest } from "./../interface/comments"
import { ListApiResponse, SuccessResponse } from "@/interface"
import { authApiRequest, publicApiRequest } from "."
import { exceptionHandler } from "./exception-handler"
import { COMMENT } from "@/types/comments"

/* 뉴스 댓글 목록 조회 */
export const getNewsComments = async (commentRequest: CommentsRequest) => {
  const { newsId, page, size, parentId } = commentRequest

  try {
    const response = await publicApiRequest.get<
      ListApiResponse<COMMENT, "comments">
    >(`/comments/news/${newsId}`, {
      params: {
        page,
        size,
        parentId,
      },
    })
    return response.item
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getNewsComments error"))
  }
}

/* 댓글 생성 */
export const createComment = async (CommentPayload: CommentPayload) => {
  try {
    const response = await authApiRequest.post(`/comments`, CommentPayload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createNewsComment error"))
  }
}

/* 댓글 수정 */
export const updateComment = async (id: number) => {
  try {
    const response = await authApiRequest.put<SuccessResponse>(
      `/comments/${id}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateNewsComment error"))
  }
}

/* 뉴스 댓글 삭제 */
export const deleteComment = async (id: number) => {
  try {
    const response = await authApiRequest.delete<SuccessResponse>(
      `/comments/${id}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API deleteNewsComment error"))
  }
}
