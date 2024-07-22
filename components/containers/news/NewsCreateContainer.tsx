"use client"

import { queries } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useSearchParams } from "next/navigation"
import React from "react"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { createNews, updateNews } from "@/services/news"
import { uploadImages } from "@/services/system"
import { UploadTarget } from "@/types"
import useMutation from "@/hooks/useMutation"
import { NewsPayload } from "@/interface/news"
import NewsForm, { NewsFormData } from "../../form/service/NewsForm"

const NewsCreateContainer = () => {
  const searchParams = useSearchParams()
  const newsId = searchParams.get("newsId")
  const { successToast, errorToast } = useToast()
  const [isUploadLoading, uploadTrasition] = useLoading()
  const pathname = usePathname()

  const { data: news } = useQuery({
    ...queries.news.detail(Number(newsId)),
    enabled: !!newsId,
  })

  const { handleForm, isLoading } = useMutation<NewsPayload>({
    createFn: (payload: NewsPayload) => createNews(payload),
    updateFn: (id: number, payload: NewsPayload) => updateNews(id, payload),
    queryKey: [...queries.news._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      create: "뉴스가 등록되었습니다.",
      update: "뉴스가 수정되었습니다.",
    },
  })

  const handleNewsForm = async (payload: NewsFormData) => {
    !newsId ? handleForm(payload) : handleForm(payload, Number(newsId))
  }

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await uploadTrasition(
        uploadImages(UploadTarget.NEWS, files, true),
      )
      successToast("뉴스 썸네일이 등록되었습니다.")
      return uploadResponse.images[0].url
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  return (
    <NewsForm
      news={news}
      handleNewsForm={handleNewsForm}
      uploadImages={handleUploadedFiles}
      isUploadLoading={isUploadLoading}
      isLoading={isLoading}
    />
  )
}

export default NewsCreateContainer
