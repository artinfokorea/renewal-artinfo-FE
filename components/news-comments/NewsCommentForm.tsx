"use client"

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

export type CommentFormData = yup.InferType<typeof commentSchema>

interface Props {
  handleCreateComment: (payload: CommentFormData, parentId?: number) => void
  isLoading: boolean
}

const NewsCommentForm = ({ handleCreateComment, isLoading }: Props) => {
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
    if (isSubmitSuccessful) reset()
  }, [isSubmitSuccessful])

  return (
    <form className="relative">
      <div className="absolute left-4 top-5 h-10 w-10 md:left-8">
        <FallbackImage
          src={user?.iconImageUrl}
          alt="user_profile_image"
          fill
          sizes="150px"
          className="rounded-full"
        />
      </div>
      <Textarea
        id="contents"
        {...register("contents")}
        placeholder={`${data?.user ? "댓글을 입력해주세요." : "로그인 후 이용해주세요."}`}
        className="h-20 w-full resize-none rounded-md border border-gray-300 px-[72px] py-6 placeholder:font-semibold focus:outline-none md:px-24 md:py-6"
      />
      <Button
        type="button"
        disabled={!isValid || isLoading || !data}
        onClick={handleSubmit(() =>
          handleCreateComment({ contents: getValues("contents") }),
        )}
        className="absolute bottom-7 right-3 h-8 rounded-full bg-main px-5 text-xs font-semibold text-white md:right-8"
      >
        등록
      </Button>
    </form>
  )
}

export default NewsCommentForm
