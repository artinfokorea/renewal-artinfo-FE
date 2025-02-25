import PostDetailClient from "@/components/posts/PostDetailClient"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { Metadata } from "next"
import React from "react"
import { convert } from "html-to-text"

interface Props {
  params: { id: string; lng?: string }
}

const getPostDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  const post = await queryClient.fetchQuery(queries.posts.detail(Number(id)))
  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const data = await getPostDetail(Number(id))

  const pageTitle = data?.title
  const pageDescription = convert(data?.contents || "")
  const pageImage = data?.thumbnailImageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `커뮤니티 | ${pageTitle}`,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
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

  const post = await getPostDetail(Number(id))

  return <PostDetailClient post={post} />
}

export default page
