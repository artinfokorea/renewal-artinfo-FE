import JobDetailCient from "@/components/jobs/JobDetailClient"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { Metadata } from "next"
import React from "react"

interface Props {
  params: { id: string }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const queryClient = GetQueryClient()
  const { id } = params

  const data = await queryClient.fetchQuery(queries.jobs.detail(Number(id)))

  const pageTitle = data?.title
  const pageImage = data?.imageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `채용 | ${pageTitle}`,
    description: `아트인포 | ${data.companyName}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${data.companyName}`,
      images: {
        url: pageImage || defaultImage,
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const queryClient = GetQueryClient()

  const job = await queryClient.fetchQuery(
    queries.jobs.detail(Number(params.id)),
  )

  return <JobDetailCient job={job} />
}

export default page
