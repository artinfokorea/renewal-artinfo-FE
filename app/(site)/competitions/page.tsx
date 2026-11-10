"use client"

import React, { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import ListPageHeader from "@/components/common/ListPageHeader"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import NewsTabs from "@/components/common/NewsTabs"
import CompetitionList from "@/components/competitions/CompetitionList"
import CompetitionListSkeleton from "@/components/skeleton/CompetitionListSkeleton"
import { COMPETITION_AREAS, COMPETITION_DIVISIONS, PHASE_OPTIONS } from "@/types/competitions"

const toOptions = (values: string[]) => values.map(value => ({ label: value === "전국" ? "전국(온라인)" : value, value }))

/** 콩쿠르 목록 — 검색 + 필터(상태·부문·지역) 한 줄, 포스터 그리드, 정렬은 마감임박순 고정 */
const page = () => {
  const router = useRouter()
  const pathname = usePathname()

  const goToCreatePage = () => {
    Cookies.set("prevPath", pathname, { expires: 1 / 288 })
    router.push(`${pathname}/create`)
  }

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-4 md:px-6 md:pt-14">
      <NewsTabs />
      <ListPageHeader title="콩쿠르" action={<CreateButton label="콩쿠르 등록" onClick={goToCreatePage} />} />
      <p className="mt-1 text-[14px] text-[#6B7684]">전국 음악 콩쿠르 접수 일정을 한곳에서 · 마감이 가까운 순</p>

      <ListToolbar
        searchPlaceholder="대회명, 주최, 지역 검색"
        groups={[
          { param: "phase", name: "상태", options: PHASE_OPTIONS },
          { param: "division", name: "부문", options: toOptions(COMPETITION_DIVISIONS) },
          { param: "area", name: "지역", options: toOptions(COMPETITION_AREAS) },
        ]}
      />

      <Suspense fallback={<CompetitionListSkeleton />}>
        <CompetitionList />
      </Suspense>

      <ArrowUpButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="scroll-to-top-button" />
    </div>
  )
}

export default page
