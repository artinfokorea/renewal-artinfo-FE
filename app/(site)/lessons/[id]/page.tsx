import LessonDetailClient from "@/components/lessons/LessonDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import GetQueryClient from "@/lib/GetQueryClient"
import { breadcrumbJsonLd, lessonServiceJsonLd } from "@/lib/jsonld"
import { queries } from "@/lib/queries"
import { DEFAULT_OG_IMAGE, htmlToPlainText, pickDescription } from "@/lib/seo"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

interface Props {
  params: { id: string; lng?: string }
}

const getLessonDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({
      ...queries.lessons.detail(id),
      staleTime: 60 * 1000,
    })
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getLessonDetail(Number(params.id))

  const majorList: Array<string | undefined> = data.majors?.length
    ? data.majors
    : [data.major]
  const areaList: Array<string | undefined> = data.areas?.length
    ? data.areas
    : [data.area]
  const majors = majorList.filter(Boolean).join(", ")
  const areas = areaList.filter(Boolean).join(", ")
  const pageTitle = majors ? `${data.name} | ${majors} 레슨` : data.name
  const description = pickDescription([
    htmlToPlainText(data.introduction, 150),
    [majors && `${majors} 레슨`, areas, data.name].filter(Boolean).join(" · "),
  ])
  const path = `/lessons/${data.id}`

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      type: "profile",
      images: {
        url: data.imageUrl || DEFAULT_OG_IMAGE,
        alt: pageTitle,
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const lesson = await getLessonDetail(Number(params.id))

  return (
    <>
      <JsonLd
        data={[
          lessonServiceJsonLd(lesson),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "레슨", path: "/lessons" },
            { name: lesson.name, path: `/lessons/${lesson.id}` },
          ]),
        ]}
      />
      <LessonDetailClient lesson={lesson} />
    </>
  )
}

export default page
