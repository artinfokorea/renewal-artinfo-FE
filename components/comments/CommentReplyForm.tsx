import { commentSchema } from "@/lib/schemas"
import { Textarea } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect } from "react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useSession } from "next-auth/react"
import FallbackImage from "../common/FallbackImage"
import { Button } from "../ui/button"
import { CommentFormData } from "./CommentForm"

interface Props {
  parentId: number
  cancelReply: () => void
  handleCreate: (payload: CommentFormData, parentId?: number) => void
}

const CommentReplyForm = ({ parentId, cancelReply, handleCreate }: Props) => {
  const { data } = useSession()
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isValid, isSubmitSuccessful },
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
    mode: "onChange",
  })

  useEffect(() => {
    if (isSubmitSuccessful) cancelReply()
  }, [isSubmitSuccessful])

  return (
    <div className="my-4 ml-12 flex min-h-16 gap-3 md:my-6">
      <div className="relative h-10 min-w-10">
        <FallbackImage
          src={user?.iconImageUrl}
          alt="user_profile_image"
          fill
          unoptimized
          sizes="150px"
          className="rounded-full"
        />
      </div>
      <div className="w-full">
        <Textarea
          id="contents"
          {...register("contents")}
          placeholder="댓글을 남겨주세요."
          className="w-full resize-none rounded-md border border-gray-300 p-4 placeholder:font-semibold focus:outline-none"
        />
        <div className="flex justify-end gap-2 text-sm">
          <button
            className="rounded-full border border-error px-3 py-1 font-semibold text-error"
            onClick={cancelReply}
          >
            취소
          </button>
          <button
            className="rounded-full bg-main px-3 py-1 text-white"
            disabled={!isValid}
            onClick={handleSubmit(() =>
              handleCreate({ contents: getValues("contents") }, parentId),
            )}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentReplyForm
