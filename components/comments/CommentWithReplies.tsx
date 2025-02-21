import { COMMENT } from "@/types/comments"
import React, { useState } from "react"
import CommentCard from "./CommentCard"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
  type: "news" | "post"
}

const CommentWithReplies = ({
  comment,
  handleDelete,
  handleUpdate,
  handleCreate,
  type,
}: Props) => {
  const params = useParams()
  const [parentCommentId, setParentCommentId] = useState<number>()
  const [showNestedCommentsSize, setNestedCommentsSize] = useState(0)
  const queryClient = useQueryClient()

  const { data: nestedNewsComments } = useQuery({
    ...queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size: showNestedCommentsSize,
      parentId: comment?.id,
    }),
    enabled:
      comment.childrenCount > 0 &&
      showNestedCommentsSize > 0 &&
      type === "news",
  })

  const { data: nestedPostComments } = useQuery({
    ...queries.comments.post({
      postId: Number(params.id),
      page: 1,
      size: showNestedCommentsSize,
      parentId: comment?.id,
    }),
    enabled:
      comment.childrenCount > 0 &&
      showNestedCommentsSize > 0 &&
      type === "post",
  })

  const nestedComments =
    type === "news" ? nestedNewsComments : nestedPostComments

  const isNestedComments =
    comment.childrenCount > 0 && comment.childrenCount > showNestedCommentsSize

  const moreButtonLabel =
    showNestedCommentsSize > 0
      ? "답글 더보기"
      : `답글 ${comment.childrenCount}개`

  const moreFetch = async () => {
    await queryClient.prefetchQuery(
      queries.comments.news({
        newsId: Number(params.id),
        page: 1,
        size: showNestedCommentsSize + 5,
        parentId: comment.id,
      }),
    )

    setNestedCommentsSize(showNestedCommentsSize + 5)
  }

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
      {isNestedComments && (
        <MoreButton
          more={moreFetch}
          label={moreButtonLabel}
          size="sm"
          className="ml-12 hidden md:flex"
        />
      )}
      {isNestedComments && (
        <button className="ml-12 font-bold md:hidden" onClick={moreFetch}>
          <p>답글 더보기</p>
        </button>
      )}
    </>
  )
}

export default CommentWithReplies
