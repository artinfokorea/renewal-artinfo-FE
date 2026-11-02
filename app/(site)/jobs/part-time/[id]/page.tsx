import { PartTimeDetailClient } from "@/components/jobs/PartTimeDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import GetQueryClient from "@/lib/GetQueryClient"
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/jsonld"
import { queries } from "@/lib/queries"
import { DEFAULT_OG_IMAGE, htmlToPlainText, pickDescription } from "@/lib/seo"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import React from "react"

interface Props {
  params: { id: string }
}

const getJobDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({
      ...queries.jobs.detail(id),
      staleTime: 60 * 1000,
    })
  } catch {
    notFound()
  }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const data = await getJobDetail(Number(params.id))

  const pageTitle = data.title
  const majors = data.majors?.majors
    ?.map(major => major.koName)
    .filter(Boolean)
    .join(", ")
  const summary = [data.companyName, majors, data.province]
    .filter(Boolean)
    .join(" | ")
  const description = pickDescription([
    [summary, htmlToPlainText(data.contents, 120)].filter(Boolean).join(" | "),
    summary,
    data.title,
  ])
  const path = `/jobs/part-time/${data.id}`

  return {
    title: `단기 채용 | ${pageTitle}`,
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
      images: {
        url: data.imageUrl || DEFAULT_OG_IMAGE,
        alt: pageTitle,
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const job = await getJobDetail(Number(params.id))

  return (
    <>
      <JsonLd
        data={[
          jobPostingJsonLd(job, { isPartTime: true }),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "단기 채용", path: "/jobs?jobTimeType=PART_TIME" },
            { name: job.title, path: `/jobs/part-time/${job.id}` },
          ]),
        ]}
      />
      <PartTimeDetailClient />
    </>
  )
}

export default page
