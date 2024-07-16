"use client"

import { deleteNews } from "@/apis/news"
import NewsDetailContainer from "@/components/news/NewsDetailContainer"
import useToast from "@/hooks/useToast"
import { queries } from "@/lib/queries"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useParams, usePathname, useRouter } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const { data: news } = useSuspenseQuery(
    queries.news.detail(Number(params.id)),
  )

  const handleDeleteNews = async () => {
    try {
      await deleteNews(Number(params.id))
      successToast("뉴스가 삭제되었습니다.")
      queryClient.invalidateQueries({
        queryKey: queries.news._def,
      })
      router.push(pathname.slice(0, pathname.lastIndexOf("/")))
    } catch (error: any) {
      errorToast(error.message)
      console.log("error", error)
    }
  }

  return (
    <section>
      <NewsDetailContainer news={news} deleteNews={handleDeleteNews} />
    </section>
  )
}

export default page
