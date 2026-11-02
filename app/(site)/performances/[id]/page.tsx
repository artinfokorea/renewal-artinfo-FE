import PerformanceDetailClient from "@/components/performances/PerformanceDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import GetQueryClient from "@/lib/GetQueryClient"
import filters from "@/lib/filters"
import { breadcrumbJsonLd, performanceEventJsonLd } from "@/lib/jsonld"
import { queries } from "@/lib/queries"
import { DEFAULT_OG_IMAGE, htmlToPlainText, pickDescription } from "@/lib/seo"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string; lng?: string }
}

const getPerformanceDetail = async (id: number) => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({
      ...queries.performances.detail(id),
      staleTime: 60 * 1000,
    })
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPerformanceDetail(Number(params.id))
  const filter = filters()

  const pageTitle = data.cast ? `${data.title} - ${data.cast}` : data.title
  const period = [
    filter.YYYYMMDD(data.startAt),
    filter.YYYYMMDD(data.endAt),
  ]
    .filter(Boolean)
    .join(" ~ ")
  const place = data.customAreaName || data.area?.name
  const summary = [period, place, data.cast && `출연 ${data.cast}`]
    .filter(Boolean)
    .join(" | ")
  const description = pickDescription([
    [summary, htmlToPlainText(data.introduction, 100)]
      .filter(Boolean)
      .join(" | "),
    summary,
    data.title,
  ])
  const path = `/performances/${data.id}`

  return {
    title: `공연 | ${pageTitle}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      images: {
        url: data.posterImageUrl || DEFAULT_OG_IMAGE,
        alt: pageTitle,
      },
    },
  }
}

const page = async ({ params }: Props) => {
  const performance = await getPerformanceDetail(Number(params.id))

  return (
    <>
      <JsonLd
        data={[
          performanceEventJsonLd(performance),
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "공연", path: "/performances" },
            {
              name: performance.title,
              path: `/performances/${performance.id}`,
            },
          ]),
        ]}
      />
      <PerformanceDetailClient performance={performance} />
    </>
  )
}

export default page
