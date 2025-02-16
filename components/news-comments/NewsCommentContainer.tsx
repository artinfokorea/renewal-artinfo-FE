"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useParams } from "next/navigation"
import { CommentType } from "@/types/news-comments"
import useMutation from "@/hooks/useMutation"
import { CommentPayload } from "@/interface/news-comments"
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/services/news-comments"
import CommentForm, { CommentFormData } from "./NewsCommentForm"
import { useState } from "react"
import CommentWithReplies from "./NewsCommentWithReplies"
import MoreButton from "../common/MoreButton"

const NewsCommentContainer = () => {
  const params = useParams()
  const [size, setSize] = useState(5)
  const queryClient = useQueryClient()
  const { handleSubmit, isLoading, handleDelete } = useMutation<CommentPayload>(
    {
      createFn: (payload: CommentPayload) => createComment(payload),
      updateFn: (id: number, payload: CommentPayload) =>
        updateComment(id, payload),
      deleteFn: (id?: number) => deleteComment(id as number),
      queryKey: [...queries.comments.news._def, Number(params.id)],
      successMessage: {
        create: "댓글이 등록되었습니다.",
        update: "댓글이 수정되었습니다.",
        delete: "댓글이 삭제되었습니다.",
      },
    },
  )

  const { data: commentList } = useQuery(
    queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size,
    }),
  )

  const handleCreateComment = (payload: CommentFormData, parentId?: number) => {
    const { contents } = payload

    const form: CommentPayload = {
      contents,
      targetId: Number(params.id),
      type: CommentType.NEWS,
    }

    if (parentId) form.parentId = parentId

    handleSubmit(form)
  }

  const moreFetch = async () => {
    await queryClient.prefetchQuery(
      queries.comments.news({
        newsId: Number(params.id),
        page: 1,
        size: size + 5,
      }),
    )

    setSize(size + 5)
  }

  return (
    <div className="my-12">
      <CommentForm
        handleCreateComment={handleCreateComment}
        isLoading={isLoading}
      />
      <div className="my-6 flex flex-col md:gap-4"></div>
      {commentList?.comments.map(comment => (
        <CommentWithReplies
          key={comment.id}
          comment={comment}
          handleDelete={handleDelete}
          handleCreate={handleCreateComment}
          handleUpdate={(id: number, payload: CommentFormData) =>
            handleSubmit({ contents: payload.contents }, id)
          }
        />
      ))}
      {(commentList?.totalCount ?? 0) > size && (
        <MoreButton
          more={moreFetch}
          label="더보기"
          size="md"
          className="mx-auto"
        />
      )}
    </div>
  )
}

export default NewsCommentContainer
