import LessonDetailClient from "@/components/lessons/LessonDetailClient"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { Metadata } from "next"
import React from "react"

interface Props {
  params: { id: string; lng?: string }
}

const getLessonDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  const lesson = await queryClient.fetchQuery(
    queries.lessons.detail(Number(id)),
  )
  return lesson
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const data = await getLessonDetail(Number(id))

  const pageTitle = data?.name
  const majors = data?.majors && data?.majors.join(", ")
  const introduction = data?.introduction.substring(0, 150)
  const pageImage = data?.imageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `${pageTitle} | ${majors}`,
    description: introduction,
    openGraph: {
      title: pageTitle,
      description: introduction,
      images: {
        url: pageImage || defaultImage,
        alt: "아트인포-ARTINFO",
      },
    },
  }
}
const page = async ({ params }: Props) => {
  const { id } = params

  const lesson = await getLessonDetail(Number(id))

  return <LessonDetailClient lesson={lesson} />
}

export default page
