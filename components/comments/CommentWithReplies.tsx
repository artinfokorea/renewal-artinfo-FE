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

  const [parentCommentId, setParentCommentId] = useState<number>()
  const [showNestedComments, setShowNestedComments] = useState(false)

  const { data: nestedComments } = useQuery({
    ...queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size: 20,
      parentId: comment?.id,
    }),
    enabled: comment.childrenCount > 0 && showNestedComments,
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
          handleReply={() => setParentCommentId(comment.id)}
        />
      ))}
      {comment.childrenCount > 0 && !showNestedComments && (
        <MoreButton
          more={() => setShowNestedComments(!showNestedComments)}
          label={`답글 ${comment.childrenCount}개`}
          size="sm"
          className="ml-12 hidden md:flex"
        />
      )}
      {comment.childrenCount > 0 && !showNestedComments && (
        <button
          className="ml-12 font-bold md:hidden"
          onClick={() => setShowNestedComments(!showNestedComments)}
        >
          <p>답글 더보기</p>
        </button>
      )}
    </>
  )
}

export default CommentWithReplies
