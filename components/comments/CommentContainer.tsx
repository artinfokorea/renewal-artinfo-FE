import React from "react"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useParams } from "next/navigation"
import { CommentType } from "@/types/comments"
import useMutation from "@/hooks/useMutation"
import { CommentPayload } from "@/interface/comments"
import { createComment } from "@/services/comments"
import CommentForm, { CommentFormData } from "../comments/CommentForm"

const CommentContainer = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { handleSubmit, isLoading } = useMutation<CommentPayload>({
    createFn: (payload: CommentPayload) => createComment(payload),
    queryKey: [...queries.comments.news._def, Number(params.id)],
    successMessage: {
      create: "댓글이 등록되었습니다.",
    },
  })

  const { data: commentList } = useQuery(
    queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size: 5,
    }),
  )

  const handleCreateComment = async (payload: CommentFormData) => {
    const { contents } = payload
    handleSubmit({
      contents,
      targetId: Number(params.id),
      type: CommentType.NEWS,
    })
  }

  return (
    <div className="my-12">
      <CommentForm
        handleCreateComment={handleCreateComment}
        isLoading={isLoading}
      />
      {/* {commentList?.items.map(comment => (

      ))} */}
    </div>
  )
}

export default CommentContainer
