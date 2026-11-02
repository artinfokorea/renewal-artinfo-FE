"use client"

import React, { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getAdminVisitors } from "@/services/admin"
import { AdminVisitor } from "@/types/admin"
import { formatDuration } from "./format"

const PAGE_SIZE = 50
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

const kstToday = () => new Date(Date.now() + KST_OFFSET_MS).toISOString().slice(0, 10)
const shiftDay = (day: string, n: number) =>
  new Date(new Date(`${day}T00:00:00Z`).getTime() + n * 86400000).toISOString().slice(0, 10)
/** DB 의 timestamp(UTC) → 한국 시각 HH:mm */
const kstTime = (iso: string) => {
  const d = new Date(new Date(iso.endsWith("Z") ? iso : `${iso}Z`).getTime() + KST_OFFSET_MS)
  return d.toISOString().slice(11, 16)
}

const Row = ({ v }: { v: AdminVisitor }) => (
  <tr className="border-t border-[#F2F4F6] align-top">
    <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-[#4E5968]">
      {kstTime(v.firstSeenAt)}–{kstTime(v.lastSeenAt)}
    </td>
    <td className="px-3 py-2.5">
      {v.nickname ? (
        <span className="font-medium text-[#191F28]">{v.nickname}</span>
      ) : (
        <span className="text-[#8B95A1]">비회원</span>
      )}
      <span className="ml-1.5 font-mono text-[11px] text-[#B0B8C1]">{v.visitorId}</span>
      {!v.engaged && (
        <span className="ml-1.5 rounded bg-[#F2F4F6] px-1.5 py-0.5 text-[11px] text-[#6B7684]">미참여</span>
      )}
    </td>
    <td className="whitespace-nowrap px-3 py-2.5 text-[#333D4B]" title={v.userAgent ?? undefined}>
      {v.device} · {v.os} · {v.browser}
    </td>
    <td className="max-w-[160px] truncate px-3 py-2.5 text-[#4E5968]" title={v.referrerHost ?? undefined}>
      {v.referrerHost ?? <span className="text-[#B0B8C1]">직접·내부</span>}
    </td>
    <td className="max-w-[180px] truncate px-3 py-2.5 text-[#4E5968]" title={v.landingPath ?? undefined}>
      {v.landingPath ?? "–"}
    </td>
    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-[#191F28]">{v.pageViews}</td>
    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-[#191F28]">
      {formatDuration(v.activeSeconds)}
    </td>
  </tr>
)

/**
 * 날짜별 방문자 목록 — 한 줄이 방문자 1명(브라우저 1개)의 그날 기록.
 * 기기·OS·브라우저 위에 마우스를 올리면 User-Agent 원문이 보인다.
 */
const VisitorList = () => {
  const [day, setDay] = useState(kstToday)
  const today = kstToday()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["admin", "visitors", day],
    queryFn: ({ pageParam }) => getAdminVisitors(day, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, p) => n + p.visitors.length, 0)
      return loaded < last.total ? loaded : undefined
    },
  })

  const visitors = data?.pages.flatMap(p => p.visitors) ?? []
  const total = data?.pages[0]?.total ?? 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="전날"
            onClick={() => setDay(shiftDay(day, -1))}
            className="h-8 w-8 rounded-lg border border-[#E5E8EB] text-[#4E5968] hover:bg-[#F7F8FA]"
          >
            ‹
          </button>
          <span className="min-w-[96px] text-center text-sm font-bold tabular-nums text-[#191F28]">{day}</span>
          <button
            type="button"
            aria-label="다음날"
            disabled={day >= today}
            onClick={() => setDay(shiftDay(day, 1))}
            className="h-8 w-8 rounded-lg border border-[#E5E8EB] text-[#4E5968] hover:bg-[#F7F8FA] disabled:opacity-40"
          >
            ›
          </button>
        </div>
        <span className="text-[13px] text-[#6B7684]">
          방문자 <strong className="tabular-nums text-[#191F28]">{total.toLocaleString()}</strong>명
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#EEF0F3]">
        <table className="w-full min-w-[820px] text-[13px]">
          <caption className="sr-only">{day} 방문자 목록</caption>
          <thead className="bg-[#F7F8FA] text-[12px] text-[#6B7684]">
            <tr>
              <th className="px-3 py-2 text-left font-medium">시간</th>
              <th className="px-3 py-2 text-left font-medium">방문자</th>
              <th className="px-3 py-2 text-left font-medium">기기 · OS · 브라우저</th>
              <th className="px-3 py-2 text-left font-medium">유입</th>
              <th className="px-3 py-2 text-left font-medium">첫 페이지</th>
              <th className="px-3 py-2 text-right font-medium">페이지</th>
              <th className="px-3 py-2 text-right font-medium">체류</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map(v => (
              <Row key={`${v.visitorId}-${v.firstSeenAt}`} v={v} />
            ))}
            {!isLoading && visitors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-coolgray">
                  이 날의 방문 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {hasNextPage && (
        <button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="h-10 rounded-[10px] border border-[#E5E8EB] text-sm text-[#4E5968] hover:bg-[#F7F8FA]"
        >
          {isFetchingNextPage ? "불러오는 중…" : `${PAGE_SIZE}명 더보기`}
        </button>
      )}
    </div>
  )
}

export default VisitorList
