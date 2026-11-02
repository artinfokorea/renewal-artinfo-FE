import { queries } from "@/lib/queries"
import React from "react"
import GetQueryClient from "@/lib/GetQueryClient"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import NewsDetailClient from "@/components/news/NewsDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/jsonld"
import { DEFAULT_OG_IMAGE, htmlToPlainText, pickDescription } from "@/lib/seo"

interface Props {
  params: { id: string }
}

const getNewsDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({
      ...queries.news.detail(id),
      staleTime: 60 * 1000,
    })
  } catch {
    notFound()
  }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const data = await getNewsDetail(Number(params.id))

  const pageTitle = data.title
  const description = pickDescription([
    data.summary,
    htmlToPlainText(data.contents, 150),
  ])
  const path = `/news/${data.id}`

  return {
    title: `뉴스 | ${pageTitle}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      type: "article",
      publishedTime: data.createdAt
        ? new Date(data.createdAt).toISOString()
        : undefined,
      authors: ["아트인포"],
      images: {
        url: data.thumbnailImageUrl || DEFAULT_OG_IMAGE,
        alt: pageTitle,
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const news = await getNewsDetail(Number(params.id))

  return (
    <section>
      <JsonLd
        data={[
          newsArticleJsonLd(news),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "뉴스", path: "/news" },
            { name: news.title, path: `/news/${news.id}` },
          ]),
        ]}
      />
      <NewsDetailClient news={news} />
    </section>
  )
}

export default page
