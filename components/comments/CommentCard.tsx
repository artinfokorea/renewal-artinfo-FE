import { COMMENT } from "@/types/comments"
import React, { useEffect, useState } from "react"
import FallbackImage from "../common/FallbackImage"
import filters from "@/lib/filters"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import ConfirmDialog from "../dialog/ConfirmDialog"
import CommentMenu from "./CommentMenu"
import { Textarea } from "@headlessui/react"
import { useForm } from "react-hook-form"
import { CommentFormData } from "./CommentForm"
import { yupResolver } from "@hookform/resolvers/yup"
import { commentSchema } from "@/lib/schemas"

interface Props {
  comment: COMMENT
  deleteComment: (id: number) => void
  isChild?: boolean
  handleUpdate: (id: number, payload: CommentFormData) => void
  handleReply?: (parentId: number) => void
}

const CommentCard = ({
  comment,
  deleteComment,
  isChild,
  handleUpdate,
  handleReply,
}: Props) => {
  const filter = filters()
  const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const { data } = useSession()
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
    mode: "onChange",
    defaultValues: {
      contents: comment.contents,
    },
  })

  const isAuthor = user?.id === comment.userId

  const handleDelete = (id: number) => {
    deleteComment(id)
    setIsDeleteConfirmDialog(false)
  }

  useEffect(() => {
    if (isSubmitSuccessful) setIsEdit(false)
  }, [isSubmitSuccessful])

  return (
    <div className={`my-4 flex min-h-16 gap-3 ${isChild && "ml-12"}`}>
      <div className="relative h-10 min-w-10">
        <FallbackImage
          src={comment?.userIconImageUrl}
          alt="user_profile_image"
          fill
          unoptimized
          sizes="150px"
          className="rounded-full"
        />
      </div>
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {comment.userNickname}
            </span>
            <span className="text-[10px] text-silver md:text-xs">
              {filter.FROM_NOW_COMMENT(comment.createdAt)}
            </span>
          </div>
          {isEdit ? (
            <div className="w-full">
              <Textarea
                id="contents"
                {...register("contents")}
                placeholder="댓글을 남겨주세요."
                className="w-full resize-none rounded-md border border-gray-300 p-4 pr-36 placeholder:font-semibold focus:outline-none"
              />
              <div className="flex justify-end gap-2 text-sm">
                <button
                  className="rounded-full border border-error px-3 py-1 font-semibold text-error"
                  onClick={() => setIsEdit(!isEdit)}
                >
                  취소
                </button>
                <button
                  className="rounded-full bg-main px-3 py-1 text-white"
                  disabled={!isDirty}
                  onClick={handleSubmit(() =>
                    handleUpdate(comment.id, {
                      contents: getValues("contents"),
                    }),
                  )}
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.contents}</p>
          )}
        </div>
      </div>
      <div className="relative flex items-start">
        <div className="flex items-center">
          {!isChild && !isEdit && (
            <button
              className="w-10 text-sm text-coolgray"
              onClick={() => {
                handleReply && handleReply(comment.id)
              }}
            >
              답글
            </button>
          )}
          {!isEdit && (
            <CommentMenu
              isAuthor={isAuthor}
              handleDelete={() =>
                setIsDeleteConfirmDialog(!isDeleteConfirmDialog)
              }
              handleEdit={() => setIsEdit(!isEdit)}
            />
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={isDeleteConfirmDialog}
        handleDialog={() => setIsDeleteConfirmDialog(!isDeleteConfirmDialog)}
        title="댓글 삭제"
        description="댓글을 삭제하시겠습니까?"
        action={() => handleDelete(comment.id)}
      />
    </div>
  )
}

export default CommentCard
