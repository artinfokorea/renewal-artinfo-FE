import { COMMENT } from "@/types/comments"
import React, { useRef, useState } from "react"
import CommentCard from "./CommentCard"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useParams } from "next/navigation"
import { CommentFormData } from "./CommentForm"
import CommentReplyForm from "./CommentReplyForm"
import MoreButton from "../common/MoreButton"
import { Spinner } from "../common/Loading"

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
  const nestedCommentRef = useRef(null)
  const [parentCommentId, setParentCommentId] = useState<number>()
  const [showNestedCommentsSize, setNestedCommentsSize] = useState(0)
  const queryClient = useQueryClient()

  const { data: nestedComments } = useQuery({
    ...queries.comments.news({
      newsId: Number(params.id),
      page: 1,
      size: showNestedCommentsSize,
      parentId: comment?.id,
    }),
    enabled: comment.childrenCount > 0 && showNestedCommentsSize > 0,
  })

  const isNestedComments =
    comment.childrenCount > 0 && comment.childrenCount > showNestedCommentsSize

  const moreButtonLabel =
    showNestedCommentsSize > 0
      ? "답글 더보기"
      : `답글 ${comment.childrenCount}개`

  const moreFetch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // if (!event.target) return

    // const buttonRect = (
    //   event.target as HTMLButtonElement
    // ).getBoundingClientRect()
    // const buttonTopRelativeToViewport = buttonRect.top

    await queryClient.prefetchQuery(
      queries.comments.news({
        newsId: Number(params.id),
        page: 1,
        size: showNestedCommentsSize + 5,
        parentId: comment.id,
      }),
    )

    setNestedCommentsSize(showNestedCommentsSize + 5)

    // if (nestedCommentRef.current) {
    //   const yOffset = +300
    //   const y = buttonTopRelativeToViewport + window.scrollY + yOffset

    //   window.scrollTo({ top: y, behavior: "smooth" })
    // }
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
      <div ref={nestedCommentRef}>
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
      </div>
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
