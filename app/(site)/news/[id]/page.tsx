import { queries } from "@/lib/queries"
import React from "react"
import GetQueryClient from "@/lib/GetQueryClient"
import { Metadata } from "next"
import NewsDetailClient from "@/components/news/NewsDetailClient"

interface Props {
  params: { id: string }
}

const getNewsDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  const news = await queryClient.fetchQuery(queries.news.detail(Number(id)))
  return news
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = params
  const data = await getNewsDetail(Number(id))

  const pageTitle = data?.title
  const pageDescription = data?.summary.substring(0, 150)
  const pageImage = data?.thumbnailImageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `뉴스 | ${pageTitle}`,
    description: pageDescription,
    openGraph: {
      title: `뉴스 | ${pageTitle}`,
      description: pageDescription,
      images: {
        url: pageImage || defaultImage,
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const { id } = params
  const news = await getNewsDetail(Number(id))

  return (
    <section>
      <NewsDetailClient news={news} />
    </section>
  )
}

export default page
