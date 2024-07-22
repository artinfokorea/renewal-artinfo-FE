"use client"

import { uploadImages } from "@/services/system"
import useToast from "@/hooks/useToast"
import { newsSchema } from "@/lib/schemas"
import { UploadTarget } from "@/types"
import { NEWS } from "@/types/news"
import { yupResolver } from "@hookform/resolvers/yup"
import { useLoading } from "@toss/use-loading"
import React, { useRef } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import ImageField from "../common/ImageField"
import FileUploader from "../common/FileUploader"
import InputField from "../common/InputField"
import { Textarea } from "@headlessui/react"
import { Spinner } from "../common/Loading"
import dynamic from "next/dynamic"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

interface Props {
  news?: NEWS
  isLoading: boolean
  isUploadLoading: boolean
  handleNewsForm: (payload: NewsFormData) => void
  uploadImages: (files: File[]) => Promise<string | undefined>
}

const CKEditor = dynamic(() => import("@/components/ckEditor/CKEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

export type NewsFormData = yup.InferType<typeof newsSchema>

const NewsForm = ({
  news,
  handleNewsForm,
  isLoading,
  isUploadLoading,
  uploadImages,
}: Props) => {
  const fileUploader = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: yupResolver(newsSchema),
    defaultValues: {
      title: news?.title,
      summary: news?.summary,
      contents: news?.contents,
      thumbnailImageUrl: news?.thumbnailImageUrl,
    },
  })

  const deleteImage = () => setValue("thumbnailImageUrl", "")

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const uploadImage = async (files: File[]) => {
    const imageUrl = await uploadImages(files)
    if (imageUrl) setValue("thumbnailImageUrl", imageUrl)
  }

  return (
    <form className="p-4 md:p-12" onSubmit={handleSubmit(handleNewsForm)}>
      <h2 className="text-center">뉴스 등록</h2>

      <ImageField
        imageUrl={watch("thumbnailImageUrl") || ""}
        isImageLoading={isUploadLoading}
        alt="news_thumbnail"
        deleteImage={deleteImage}
        openFileUploader={openFileUploader}
        className="mx-auto my-8 h-[300px] w-full md:w-2/3"
      />
      <div className="mx-auto w-full md:w-2/3">
        <InputField
          label="제목"
          id="title"
          type="text"
          register={register}
          errors={errors.title}
          placeholder="제목을 입력해주세요."
          className="py-3 text-sm"
        />
        <Textarea
          id="contents"
          {...register("summary")}
          placeholder="요약 내용을 입력해주세요."
          className="mt-1 h-[200px] w-full rounded-md border border-gray-300 p-3 text-sm"
        />

        <CKEditor
          value={watch("contents")}
          onChange={(value: string) => setValue("contents", value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="h-9 rounded-3xl border px-6 text-sm"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="h-9 rounded-3xl bg-main px-6 text-sm text-white"
          >
            {isLoading ? (
              <Spinner className="h-6 w-6" />
            ) : news ? (
              "수정"
            ) : (
              "등록"
            )}
          </Button>
        </div>
      </div>

      <FileUploader ref={fileUploader} uploadedFiles={uploadImage} />
    </form>
  )
}

export default NewsForm
