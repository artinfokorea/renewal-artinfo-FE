"use client"

import { deleteNews } from "@/services/news"
import NewsDetailContainer from "@/components/news/NewsDetailContainer"
import useMutation from "@/hooks/useMutation"
import { queries } from "@/lib/queries"
import { useParams, usePathname } from "next/navigation"
import React from "react"
import { NEWS } from "@/types/news"

interface Props {
  news: NEWS
}

const NewsDetailClient = ({ news }: Props) => {
  const params = useParams()
  const pathname = usePathname()

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

export default NewsDetailClient
