"use client"

import { queries } from "@/lib/queries"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import NewsForm, { NewsFormData } from "./NewsForm"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { createNews, updateNews } from "@/apis/news"
import { uploadImages } from "@/apis/system"
import { UploadTarget } from "@/types"

const NewsCreateContainer = () => {
  const searchParams = useSearchParams()
  const newsId = searchParams.get("newsId")
  const { successToast, errorToast } = useToast()
  const [isHandleFormLoading, handleFormTransition] = useLoading()
  const [isUploadLoading, uploadTrasition] = useLoading()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { data: news } = useQuery({
    ...queries.news.detail(Number(newsId)),
    enabled: !!newsId,
  })

  const handleNewsForm = async (payload: NewsFormData) => {
    try {
      await handleFormTransition(
        !newsId ? createNews(payload) : updateNews(Number(newsId), payload),
      )
      successToast(
        !newsId ? "뉴스가 등록되었습니다." : "뉴스가 수정되었습니다.",
      )
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
      queryClient.invalidateQueries({
        queryKey: queries.news._def,
      })
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
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
      isLoading={isHandleFormLoading}
    />
  )
}

export default NewsCreateContainer
