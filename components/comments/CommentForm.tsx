import { commentSchema } from "@/lib/schemas"
import { Textarea } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { useSession } from "next-auth/react"
import FallbackImage from "../common/FallbackImage"
import { Button } from "../ui/button"

export type CommentFormData = yup.InferType<typeof commentSchema>

interface Props {
  handleCreateComment: (payload: CommentFormData) => void
  isLoading: boolean
}

const CommentForm = ({ handleCreateComment, isLoading }: Props) => {
  const { data } = useSession()
  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CommentFormData>({
    resolver: yupResolver(commentSchema),
    mode: "onChange",
  })

  return (
    <form className="relative">
      <div className="absolute left-8 top-5 h-10 w-10">
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
        placeholder="댓글을 남겨주세요."
        className="h-20 w-full resize-none rounded-md border border-gray-300 px-24 py-6 placeholder:font-semibold focus:outline-none"
      />
      <Button
        type="button"
        disabled={!isValid || isLoading}
        onClick={handleSubmit(handleCreateComment)}
        className="absolute bottom-7 right-8 h-8 rounded-full bg-main px-5 text-xs font-semibold text-white"
      >
        등록
      </Button>
    </form>
  )
}

export default CommentForm
