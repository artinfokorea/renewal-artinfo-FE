import JobDetailCient from "@/components/jobs/JobDetailClient"
import { PartTimeDetailClient } from "@/components/jobs/PartTimeDetailClient"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { Metadata } from "next"
import React from "react"

interface Props {
  params: { id: string }
}

const getJobDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  const job = await queryClient.fetchQuery(queries.jobs.detail(Number(id)))
  return job
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = params

  const data = await getJobDetail(Number(id))

  const pageTitle = data?.title
  const pageImage = data?.imageUrl
  const defaultImage = "/img/metadata_image.png"

  return {
    title: `단기 채용 | ${pageTitle}`,
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

const page = async () => {
  return <PartTimeDetailClient />
}

export default page
