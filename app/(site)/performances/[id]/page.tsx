import PerformanceDetailClient from "@/components/performances/PerformanceDetailClient"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { Metadata } from "next"

interface Props {
  params: { id: string; lng?: string }
}

const getPerformanceDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  const performance = await queryClient.fetchQuery(
    queries.performances.detail(Number(id)),
  )
  return performance
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const data = await getPerformanceDetail(Number(id))

  const pageTitle = `${data.cast} - ${data.title}`
  const pageDescription = data.cast
  const pageImage = data?.posterImageUrl

  return {
    title: `공연 | ${pageTitle}`,
    description: `아트인포 | ${pageDescription}`,
    openGraph: {
      title: pageTitle,
      description: `아트인포 | ${pageDescription} `,
      images: {
        url: pageImage,
        alt: "아트인포-ARTINFO",
      },
    },
  }
}
const page = async ({ params }: Props) => {
  const { id } = params

  const performance = await getPerformanceDetail(Number(id))

  return <PerformanceDetailClient performance={performance} />
}

export default page
