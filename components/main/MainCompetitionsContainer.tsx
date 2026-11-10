"use client"

import Link from "next/link"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { queries } from "@/lib/queries"
import CompetitionCard from "../competitions/CompetitionCard"

/** 홈 '콩쿠르 NEW' — 공연 줄과 같은 포스터 줄, 마감 가까운 5건. 데이터가 없거나 못 받으면 섹션을 숨긴다 */
const MainCompetitionsContainer = () => {
  const { data } = useQuery(queries.competitions.list({ page: 1, size: 5 }))
  const competitions = data?.competitions ?? []
  if (competitions.length === 0) return null

  return (
    <section className="my-12 md:my-16">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          콩쿠르
          <span className="rounded-md bg-main px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white">NEW</span>
        </h3>
        <Link href="/competitions">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <ul className="mt-4 hidden grid-cols-5 gap-4 md:grid">
        {competitions.map(competition => (
          <CompetitionCard key={competition.id} competition={competition} compact />
        ))}
      </ul>
      <div className="mt-4 md:hidden">
        <Swiper spaceBetween={10} slidesPerView="auto">
          {competitions.map(competition => (
            <SwiperSlide key={competition.id} style={{ width: "150px" }}>
              <CompetitionCard competition={competition} compact />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default MainCompetitionsContainer
