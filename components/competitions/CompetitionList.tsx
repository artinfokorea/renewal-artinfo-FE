"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { ScrollApiResponse } from "@/interface"
import { queries } from "@/lib/queries"
import { COMPETITION, CompetitionPhase } from "@/types/competitions"
import CompetitionCard from "./CompetitionCard"

/** 콩쿠르 목록 — 포스터 그리드(모바일 2칸·데스크톱 4칸), 서버 정렬(마감임박순) 그대로 */
const CompetitionList = () => {
  const searchParams = useSearchParams()
  const queryParams = {
    size: 20,
    keyword: searchParams.get("keyword") ?? "",
    phases: searchParams.getAll("phase") as CompetitionPhase[],
    divisions: searchParams.getAll("division"),
    areas: searchParams.getAll("area"),
  }

  const [ref, inView] = useInView({ delay: 100, threshold: 0.5 })

  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery<
    ScrollApiResponse<COMPETITION, "competitions">
  >({
    ...queries.competitions.infiniteList(queryParams),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.isLast ? null : lastPage.nextPage),
  })

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  const isEmpty = !data?.pages?.[0]?.competitions?.length

  return (
    <section aria-label="콩쿠르 목록" className="mt-4 md:mt-6">
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          조건에 맞는 콩쿠르가 없어요. 필터를 바꿔 보세요.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4 md:gap-x-4 md:gap-y-7">
          {data.pages.map(page =>
            page.competitions.map((competition, index) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                ref={ref}
                isLastPage={!(hasNextPage && index === page.competitions.length - 4)}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default CompetitionList
