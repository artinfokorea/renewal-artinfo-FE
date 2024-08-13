import { COMMENT } from "@/types/comments"
import React, { useState } from "react"
import CommentCard from "./CommentCard"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useParams } from "next/navigation"
import { CommentFormData } from "./CommentForm"
import CommentReplyForm from "./CommentReplyForm"
import MoreButton from "../common/MoreButton"

interface Props {
  comment: COMMENT
  handleDelete: (id: number) => void
  handleUpdate: (id: number, payload: CommentFormData) => void
  handleCreate: (payload: CommentFormData, parentId?: number) => void
}

const CommentWithReplies = ({
  comment,
  handleDelete,
  handleUpdate,
  handleCreate,
}: Props) => {
  const params = useParams()
  const [nestedCommentsSize, setNestedCommentsSize] = useState(5)
  const [parentCommentId, setParentCommentId] = useState<number>()

  const { data: nestedComments } = useQuery({
    ...queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size: nestedCommentsSize,
      parentId: comment?.id,
    }),
    enabled: comment.childrenCount > 0,
  })

  return (
    <>
      <CommentCard
        comment={comment}
        deleteComment={handleDelete}
        handleUpdate={handleUpdate}
        handleReply={(parentId: number) => setParentCommentId(parentId)}
      />
      {parentCommentId && (
        <CommentReplyForm
          parentId={parentCommentId}
          handleCreate={handleCreate}
          cancelReply={() => setParentCommentId(undefined)}
        />
      )}
      {nestedComments?.comments.map(nestedComment => (
        <CommentCard
          key={nestedComment.id}
          comment={nestedComment}
          isChild
          deleteComment={handleDelete}
          handleUpdate={handleUpdate}
        />
      ))}
      {comment.childrenCount > nestedCommentsSize && (
        <MoreButton
          more={() => setNestedCommentsSize(nestedCommentsSize + 5)}
          label="답글 더보기"
          size="sm"
        />
      )}
    </>
  )
}

export default CommentWithReplies
