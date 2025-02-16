"use client"

import { Button, Input } from "@headlessui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/navigation"
import * as yup from "yup"
import { ErrorMessage } from "@hookform/error-message"
import { Spinner } from "../common/Loading"
import { postSchema } from "@/lib/schemas"
import { Post, PostCategory, PostCategoryLabel } from "@/types/posts"
import CKEditor from "../ckEditor/CKEditor"
import { useEffect } from "react"

export type PostFormData = yup.InferType<typeof postSchema>

interface Props {
  isFormLoading: boolean
  handlePost: (payload: PostFormData) => void
  post?: Post
}

const LessonForm = ({ handlePost, isFormLoading, post }: Props) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    mode: "onChange",
  })

  useEffect(() => {
    reset({
      title: post?.title || "",
      contents: post?.contents || "",
      category: post?.category,
    })
  }, [post])

  return (
    <form className="mt-8 px-4 md:mt-16" onSubmit={handleSubmit(handlePost)}>
      <div className="space-x-2">
        {Object.entries(PostCategoryLabel).map(([key, value]) => (
          <Button
            onClick={() => setValue("category", key as PostCategory)}
            key={value}
            className={`h-8 w-[65px] rounded-[25px] border border-main px-4 text-xs font-semibold hover:bg-main hover:text-white ${watch("category") === key ? "bg-main text-white" : "bg-white text-black"}`}
          >
            {value}
          </Button>
        ))}
        <ErrorMessage
          errors={errors}
          name="category"
          render={({ message }) => (
            <p className="mt-2 text-xs font-semibold text-error">{message}</p>
          )}
        />
      </div>
      <div className="my-4">
        <Input
          {...register("title")}
          className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
          placeholder="제목을 입력해주세요."
        />
        <ErrorMessage
          errors={errors}
          name="title"
          render={({ message }) => (
            <p className="text-xs font-semibold text-error">{message}</p>
          )}
        />
      </div>
      <div className="my-6 h-[300px] md:h-[500px]">
        <CKEditor
          value={watch("contents")}
          onChange={(value: string) => setValue("contents", value)}
        />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => (
            <p className="text-xs font-semibold text-error">{message}</p>
          )}
        />
      </div>
      <div className="mt-64 flex justify-end gap-2 md:mt-16">
        <Button
          type="button"
          className="h-9 rounded-3xl border px-6 text-sm"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          disabled={isFormLoading}
          type="submit"
          className="h-9 rounded-3xl bg-main px-6 text-sm text-white disabled:bg-gray-300"
        >
          {isFormLoading ? (
            <Spinner className="h-6 w-6" />
          ) : post ? (
            "수정"
          ) : (
            "등록"
          )}
        </Button>
      </div>
    </form>
  )
}

export default LessonForm
