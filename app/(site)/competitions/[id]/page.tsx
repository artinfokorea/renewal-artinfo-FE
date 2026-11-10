import { Metadata } from "next"
import React from "react"
import CompetitionDetailClient from "@/components/competitions/CompetitionDetailClient"
import JsonLd from "@/components/seo/JsonLd"
import GetQueryClient from "@/lib/GetQueryClient"
import { breadcrumbJsonLd } from "@/lib/jsonld"
import { queries } from "@/lib/queries"
import { DEFAULT_OG_IMAGE, pickDescription } from "@/lib/seo"
import { COMPETITION } from "@/types/competitions"

interface Props {
  params: { id: string }
}

/** 게시된 공고만 서버에서 받는다. 검토 중인 내 공고는 null 로 두고 브라우저가 토큰으로 다시 조회한다 */
const getCompetition = async (id: number): Promise<COMPETITION | null> => {
  const queryClient = GetQueryClient()
  try {
    return await queryClient.fetchQuery({ ...queries.competitions.detail(id), staleTime: 60 * 1000 })
  } catch {
    return null
  }
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const competition = await getCompetition(Number(params.id))
  if (!competition) return { title: "콩쿠르 | 아트인포", robots: { index: false } }
  const summary = [competition.host, competition.divisions.join(" · "), competition.area, `접수 ${competition.openAt} ~ ${competition.closeAt}`].filter(Boolean).join(" | ")
  const description = pickDescription([[summary, competition.description ?? ""].filter(Boolean).join(" | "), summary, competition.title])
  const path = `/competitions/${competition.id}`
  return {
    title: `콩쿠르 | ${competition.title}`,
    description,
    alternates: { canonical: path },
    openGraph: { title: competition.title, description, url: path, type: "article", images: { url: competition.posterUrl || DEFAULT_OG_IMAGE, alt: competition.title } },
  }
}

const page = async ({ params }: Props) => {
  const id = Number(params.id)
  const competition = await getCompetition(id)

  return (
    <>
      {competition && (
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "홈", path: "/" },
              { name: "콩쿠르", path: "/competitions" },
              { name: competition.title, path: `/competitions/${competition.id}` },
            ]),
          ]}
        />
      )}
      <CompetitionDetailClient id={id} initial={competition} />
    </>
  )
}

export default page
