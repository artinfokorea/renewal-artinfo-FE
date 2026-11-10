import Link from "next/link"
import React, { forwardRef } from "react"
import FallbackImage from "../common/FallbackImage"
import { AspectRatio } from "../ui/aspect-ratio"
import { COMPETITION, DIVISION_COLOR, PHASE_LABEL } from "@/types/competitions"
import filters from "@/lib/filters"

interface Props {
  competition: COMPETITION
  isLastPage?: boolean
  /** 홈 섹션처럼 작게 쓸 때 */
  compact?: boolean
}

/** 포스터 위에 얹는 D-day 또는 상태 배지 */
export const PhaseBadge = ({ competition }: { competition: COMPETITION }) => {
  const { phase, dDay, openIn } = competition
  if (phase === "UPCOMING")
    return (
      <span className="rounded-md bg-[#191F28]/75 px-1.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-sm">
        접수 D-{openIn}
      </span>
    )
  if (phase === "OPEN" || phase === "SOON")
    return (
      <span
        className={`rounded-md px-1.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-sm ${
          phase === "SOON" ? "bg-[#E5484D]" : "bg-[#191F28]/75"
        }`}
      >
        {dDay === 0 ? "오늘 마감" : `D-${dDay}`}
      </span>
    )
  return (
    <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-[#6B7684]">
      {PHASE_LABEL[phase]}
    </span>
  )
}

/** 포스터 — 없으면 부문 색 블록에 부문·연도 */
export const CompetitionPoster = ({
  competition,
  sizes,
}: {
  competition: COMPETITION
  sizes: string
}) => {
  const main = competition.divisions[0] ?? "종합"
  const label = competition.divisions.length > 1 ? "종합" : main
  const year = (competition.heldAt ?? competition.closeAt).slice(0, 4)
  return (
    <AspectRatio ratio={3 / 4} className="relative overflow-hidden rounded-xl bg-[#F2F4F6]">
      {competition.posterUrl ? (
        <FallbackImage
          src={competition.posterUrl}
          alt={`${competition.title} 포스터`}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-end p-2.5 text-[13px] font-extrabold leading-tight text-white"
          style={{ backgroundColor: DIVISION_COLOR[main] ?? DIVISION_COLOR["종합"] }}
        >
          <span className="relative">
            {label} · {year}
          </span>
        </div>
      )}
      <div className="absolute left-2 top-2 flex gap-1">
        <PhaseBadge competition={competition} />
      </div>
      {competition.source === "OWNER" && competition.verified && (
        <span className="absolute bottom-2 right-2 rounded-md bg-main px-1.5 py-0.5 text-[10px] font-extrabold text-white">
          주최 ✓
        </span>
      )}
    </AspectRatio>
  )
}

/**
 * 콩쿠르 포스터 카드 — 포스터(3:4) 위 D-day, 아래 대회명·주최·마감일·지역.
 * 목록(데스크톱 4칸·모바일 2칸)과 홈 섹션이 같이 쓴다.
 */
const CompetitionCard = forwardRef<HTMLDivElement, Props>(
  ({ competition, isLastPage = true, compact }, ref) => {
    const filter = filters()
    const sub =
      competition.phase === "UPCOMING"
        ? `${filter.YYYYMMDD(competition.openAt, "YY.MM.DD")} 접수 시작`
        : competition.phase === "OPEN" || competition.phase === "SOON"
          ? `${filter.YYYYMMDD(competition.closeAt, "YY.MM.DD")} 마감 · ${competition.area}`
          : `대회 ${filter.YYYYMMDD(competition.heldAt ?? competition.closeAt, "YY.MM.DD")} · ${competition.area}`

    return (
      <li className="min-w-0 list-none">
        <Link href={`/competitions/${competition.id}`} className="group block">
          <CompetitionPoster
            competition={competition}
            sizes={compact ? "(max-width: 768px) 150px, 200px" : "(max-width: 768px) 50vw, 240px"}
          />
          <h3
            className={`mt-2 line-clamp-2 font-bold leading-snug text-[#191F28] group-hover:text-main ${
              compact ? "text-[14px]" : "text-[15px]"
            }`}
          >
            {competition.title}
          </h3>
          {!compact && (
            <p className="mt-0.5 truncate text-[13px] text-[#4E5968]">{competition.host}</p>
          )}
          <p className="mt-0.5 truncate text-[12px] text-[#6B7684]">{sub}</p>
        </Link>
        {!isLastPage && <div ref={ref} />}
      </li>
    )
  },
)

CompetitionCard.displayName = "CompetitionCard"
export default CompetitionCard
