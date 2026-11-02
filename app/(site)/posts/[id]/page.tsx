import PostDetailClient from "@/components/posts/PostDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import GetQueryClient from "@/lib/GetQueryClient"
import { breadcrumbJsonLd, postJsonLd } from "@/lib/jsonld"
import { queries } from "@/lib/queries"
import { DEFAULT_OG_IMAGE, htmlToPlainText, pickDescription } from "@/lib/seo"
import { PostCategoryLabel } from "@/types/posts"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

interface Props {
  params: { id: string; lng?: string }
}

const getPostDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({
      ...queries.posts.detail(id),
      staleTime: 60 * 1000,
    })
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPostDetail(Number(params.id))

  const pageTitle = data.title
  const category = PostCategoryLabel[data.category]
  const description = pickDescription([
    htmlToPlainText(data.contents, 150),
    [category, data.authorName].filter(Boolean).join(" · "),
  ])
  const path = `/posts/${data.id}`

  return {
    title: `커뮤니티 | ${pageTitle}`,
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
      authors: data.authorName ? [data.authorName] : undefined,
      images: {
        url: data.thumbnailImageUrl || DEFAULT_OG_IMAGE,
        alt: pageTitle,
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const post = await getPostDetail(Number(params.id))

  return (
    <>
      <JsonLd
        data={[
          postJsonLd(post),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "커뮤니티", path: "/posts" },
            { name: post.title, path: `/posts/${post.id}` },
          ]),
        ]}
      />
      <PostDetailClient post={post} />
    </>
  )
}

export default page
