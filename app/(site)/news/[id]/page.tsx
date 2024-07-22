"use client"

import { deleteNews } from "@/services/news"
import NewsDetailContainer from "@/components/containers/news/NewsDetailContainer"
import useMutation from "@/hooks/useMutation"
import { queries } from "@/lib/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useParams, usePathname } from "next/navigation"
import React from "react"

const page = () => {
  const params = useParams()
  const pathname = usePathname()

  const { data: news } = useSuspenseQuery(
    queries.news.detail(Number(params.id)),
  )

  const { handleDelete } = useMutation({
    deleteFn: () => deleteNews(Number(params.id) as number),
    queryKey: [...queries.news._def],
    redirectPath: pathname.slice(0, pathname.lastIndexOf("/")),
    successMessage: {
      delete: "뉴스가 삭제되었습니다.",
    },
  })

  return (
    <section>
      <NewsDetailContainer news={news} deleteNews={handleDelete} />
    </section>
  )
}

export default page
