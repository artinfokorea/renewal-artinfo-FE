"use client"

import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useParams } from "next/navigation"
import { CommentType } from "@/types/comments"
import useMutation from "@/hooks/useMutation"
import { CommentPayload } from "@/interface/comments"
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/services/comments"
import CommentForm, { CommentFormData } from "../comments/CommentForm"
import { useState } from "react"
import CommentWithReplies from "./CommentWithReplies"
import MoreButton from "../common/MoreButton"

const CommentContainer = () => {
  const params = useParams()
  const [size, setSize] = useState(5)
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
          more={() => setSize(size + 5)}
          label="더보기"
          size="md"
          className="mx-auto"
        />
      )}
    </div>
  )
}

export default CommentContainer
