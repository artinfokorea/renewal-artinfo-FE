"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { queries } from "@/lib/queries"
import filters from "@/lib/filters"
import { APPLY_METHOD_LABEL, COMPETITION, PHASE_LABEL } from "@/types/competitions"
import { UserType } from "@/types/users"
import ConfirmDialog from "../dialog/ConfirmDialog"
import ItemManageBox from "../common/ItemManageBox"
import { CompetitionPoster } from "./CompetitionCard"

interface Props {
  competition: COMPETITION
  deleteCompetition: () => void
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md bg-[#F7F8FA] px-1.5 py-0.5 text-[12px] text-[#6B7684]">{children}</span>
)

const PHASE_PILL: Record<string, string> = {
  OPEN: "bg-[#E6F7EF] text-[#00A86B]",
  SOON: "bg-[#FDECEC] text-[#E5484D]",
  UPCOMING: "bg-[#E8F3FF] text-[#1B64DA]",
  JUDGING: "bg-[#FFF3E0] text-[#FF8A00]",
  CLOSED: "bg-[#F2F4F6] text-[#6B7684]",
}

/**
 * 콩쿠르 상세 — 데모와 같은 구성: 포스터·제목 → 핵심 표 → 일정 → 시상 → 소개, 오른쪽(데스크톱)/하단 고정(모바일) 접수 CTA.
 * 내가 등록한 공고면 맨 위에 수정·삭제 띠.
 */
const CompetitionDetailContainer = ({ competition: c, deleteCompetition }: Props) => {
  const filter = filters()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data: user } = useQuery({ ...queries.users.detail(), enabled: !!session?.user })
  const [isDeleteDialog, setIsDeleteDialog] = useState(false)
  const isMine = !!user?.id && user.id === c.authorId
  const isAdmin = user?.type === UserType.ADMIN
  const canManage = isMine || isAdmin

  const steps = [
    { label: "접수 시작", date: c.openAt, done: c.openIn <= 0 },
    { label: "접수 마감", date: c.closeAt, done: c.dDay < 0 },
    { label: "대회", date: c.heldAt, done: c.phase === "CLOSED" },
    { label: "결과 발표", date: c.resultAt, done: c.phase === "CLOSED" },
  ].filter(step => step.date)
  const nowIndex = steps.findIndex(step => !step.done)

  const big =
    c.phase === "UPCOMING"
      ? { value: `D-${c.openIn}`, sub: "접수 시작까지", hot: false }
      : c.phase === "OPEN" || c.phase === "SOON"
        ? { value: c.dDay === 0 ? "오늘 마감" : `D-${c.dDay}`, sub: `${filter.YYYYMMDD(c.closeAt)} 23:59 마감`, hot: true }
        : c.phase === "JUDGING"
          ? { value: "심사중", sub: `대회 ${filter.YYYYMMDD(c.heldAt ?? c.closeAt)}`, hot: false }
          : { value: "종료", sub: `대회 ${filter.YYYYMMDD(c.heldAt ?? c.closeAt)}`, hot: false }

  const canApply = c.phase === "OPEN" || c.phase === "SOON"
  const applyHref =
    c.applyMethod === "LINK" && c.applyLink
      ? c.applyLink
      : c.applyMethod === "EMAIL" && c.email
        ? `mailto:${c.email}`
        : c.applyMethod === "CONTACT" && c.tel
          ? `tel:${c.tel.replace(/[^0-9+]/g, "")}`
          : null

  const Cta = ({ className = "" }: { className?: string }) =>
    canApply && applyHref ? (
      <a
        href={applyHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex h-12 items-center justify-center rounded-xl bg-main text-[15px] font-bold text-white hover:bg-blue-600 ${className}`}
      >
        {c.applyMethod === "EMAIL" ? "이메일로 접수하기" : c.applyMethod === "CONTACT" ? `전화 문의 ${c.tel}` : "접수처 바로가기 ↗"}
      </a>
    ) : (
      <div
        className={`flex h-12 items-center justify-center rounded-xl bg-[#F2F4F6] text-[15px] font-bold text-[#8B95A1] ${className}`}
      >
        {canApply ? `접수 방법: ${APPLY_METHOD_LABEL[c.applyMethod]}` : c.phase === "UPCOMING" ? "아직 접수 전이에요" : "접수가 끝났어요"}
      </div>
    )

  return (
    <div className="mx-auto max-w-[1040px] px-4 pb-24 pt-4 md:px-6 md:pb-10 md:pt-8">
      <button type="button" onClick={() => router.push("/competitions")} className="mb-4 text-[14px] text-[#6B7684]">
        ‹ 콩쿠르 목록
      </button>

      {canManage && (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#E8F3FF] px-4 py-3 text-[13px] font-semibold text-[#1B64DA]">
          <span>
            {isMine ? "내가 등록한 공고" : "관리자"}
            {c.status === "REVIEW" ? " · 검토 중 (등록자에게만 보여요)" : ` · 조회 ${c.viewCount.toLocaleString()}`}
          </span>
          <ItemManageBox
            className="ml-auto h-9"
            handleEdit={() => router.push(`${pathname}?type=edit`)}
            handleDelete={() => setIsDeleteDialog(true)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-7 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_minmax(0,1fr)] md:gap-6">
            <div className="mx-auto w-full max-w-[360px] md:mx-0 md:max-w-none">
              <CompetitionPoster competition={c} sizes="(max-width: 768px) 360px, 300px" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded-md px-2 py-0.5 text-[12px] font-bold ${PHASE_PILL[c.phase]}`}>{PHASE_LABEL[c.phase]}</span>
                {c.source === "OWNER" && (
                  <span className="text-[11px] font-bold text-[#1B64DA]">✓ 주최 등록{c.verified ? " · 인증" : ""}</span>
                )}
              </div>
              <h1 className="mt-1.5 break-keep text-[19px] font-extrabold leading-snug text-[#191F28] md:text-2xl">{c.title}</h1>
              <p className="mt-1 text-[14px] text-[#4E5968] md:text-[15px]">
                {c.host}
                {c.organizer && ` · 주관 ${c.organizer}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Tag>{c.area}</Tag>
                {c.divisions.map(d => (
                  <Tag key={d}>{d}</Tag>
                ))}
                {c.ages.length > 0 && <Tag>{c.ages.length >= 4 ? "전연령" : c.ages.join("·")}</Tag>}
              </div>
            </div>
          </div>

          <dl className="mt-6 overflow-hidden rounded-2xl border border-[#E5E8EB] text-[14px]">
            {[
              ["접수기간", `${filter.YYYYMMDD(c.openAt)} ~ ${filter.YYYYMMDD(c.closeAt)}`, "마감일 23:59 까지"],
              ["대회일", c.heldAt ? filter.YYYYMMDD(c.heldAt, "YYYY.MM.DD (ddd)") : "요강 참조", null],
              ["장소", c.venue ?? "요강 참조", c.area],
              ["부문·대상", c.divisions.join(" · "), c.ages.join(" · ") || null],
              ["참가비", c.fee ?? "요강 참조", null],
              ["접수 방법", APPLY_METHOD_LABEL[c.applyMethod], c.applyMethod === "EMAIL" ? c.email : c.applyMethod === "CONTACT" ? c.tel : null],
            ].map(([k, v, s], i) => (
              <div key={String(k)} className={`grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-4 py-3 ${i > 0 ? "border-t border-[#F2F4F6]" : ""}`}>
                <dt className="font-medium text-[#6B7684]">{k}</dt>
                <dd className="font-medium text-[#191F28]">
                  {v}
                  {s && <span className="block text-[13px] font-normal text-[#6B7684]">{s}</span>}
                </dd>
              </div>
            ))}
          </dl>

          {steps.length > 1 && (
            <section className="mt-7">
              <h2 className="mb-3 text-[17px] font-extrabold">일정</h2>
              <ol className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                <div className="absolute left-3 right-3 top-[9px] h-0.5 bg-[#E5E8EB]" />
                {steps.map((step, i) => (
                  <li key={step.label} className="relative pt-6 text-[12px] text-[#6B7684] md:text-[13px]">
                    <span
                      className={`absolute left-0 top-[3px] h-3.5 w-3.5 rounded-full border-[3px] ${
                        i === nowIndex ? "border-main bg-main ring-4 ring-[#E8F3FF]" : step.done ? "border-[#191F28] bg-[#191F28]" : "border-[#E5E8EB] bg-white"
                      }`}
                    />
                    <b className={`block text-[13px] md:text-[14px] ${i === nowIndex ? "text-[#1B64DA]" : "text-[#191F28]"}`}>{step.label}</b>
                    {filter.YYYYMMDD(step.date, "YY.MM.DD")}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {c.prize && (
            <section className="mt-7">
              <h2 className="mb-3 text-[17px] font-extrabold">시상</h2>
              <p className="whitespace-pre-line text-[14px] leading-7 text-[#4E5968]">{c.prize}</p>
            </section>
          )}
          {c.description && (
            <section className="mt-7">
              <h2 className="mb-3 text-[17px] font-extrabold">소개</h2>
              <p className="whitespace-pre-line text-[14px] leading-7 text-[#4E5968]">{c.description}</p>
            </section>
          )}
          {c.contentImages?.length > 0 && (
            <section className="mt-7">
              <h2 className="mb-3 text-[17px] font-extrabold">공고 내용</h2>
              <div className="flex flex-col gap-3">
                {c.contentImages.map((url, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url} src={url} alt={`공고 내용 ${index + 1}`} loading="lazy" className="w-full rounded-xl border border-[#F2F4F6]" />
                ))}
              </div>
            </section>
          )}
          {c.documentUrl && (
            <section className="mt-7">
              <h2 className="mb-3 text-[17px] font-extrabold">요강</h2>
              <a href={c.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-[#E5E8EB] px-4 py-3 text-[14px] font-medium hover:bg-[#F7F8FA]">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#E8F3FF] text-[11px] font-extrabold text-[#1B64DA]">파일</span>
                요강 내려받기
              </a>
            </section>
          )}
        </div>

        <aside className="hidden md:sticky md:top-24 md:flex md:flex-col md:gap-3">
          <div className="rounded-2xl border border-[#E5E8EB] p-5">
            <div className="text-[13px] text-[#6B7684]">{c.phase === "UPCOMING" ? "접수 시작" : "접수 마감"}</div>
            <div className={`mt-0.5 text-[26px] font-extrabold tracking-tight ${big.hot ? "text-[#E5484D]" : "text-[#191F28]"}`}>
              {big.value}
              <span className="ml-1.5 text-[13px] font-medium text-[#6B7684]">{big.sub}</span>
            </div>
            <Cta className="mt-4" />
            <p className="mt-3 text-[12px] leading-5 text-[#8B95A1]">접수는 주최 측에서 진행합니다. 아트인포는 접수를 대행하지 않으며 참가비를 받지 않습니다.</p>
          </div>
          <div className="rounded-2xl border border-[#E5E8EB] p-4 text-[14px]">
            <h3 className="mb-1.5 text-[14px] font-bold">문의</h3>
            <div className="flex gap-2 py-0.5 text-[#4E5968]"><span className="w-12 shrink-0 text-[#6B7684]">주최</span>{c.host}</div>
            {c.tel && <div className="flex gap-2 py-0.5 text-[#4E5968]"><span className="w-12 shrink-0 text-[#6B7684]">전화</span>{c.tel}</div>}
            {c.email && <div className="flex gap-2 py-0.5 text-[#4E5968]"><span className="w-12 shrink-0 text-[#6B7684]">이메일</span><span className="break-all">{c.email}</span></div>}
          </div>
        </aside>
      </div>

      {/* 모바일 하단 고정 CTA — 하단 네비(h-20) 위 */}
      <div className="fixed inset-x-0 bottom-20 z-40 flex items-center gap-3 border-t border-[#E5E8EB] bg-white px-4 py-2.5 md:hidden">
        <div className="min-w-[72px] shrink-0">
          <b className={`block text-[17px] font-extrabold leading-tight ${big.hot ? "text-[#E5484D]" : "text-[#191F28]"}`}>{big.value}</b>
          <span className="text-[11px] text-[#6B7684]">{big.sub}</span>
        </div>
        <Cta className="flex-1" />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialog}
        handleDialog={() => setIsDeleteDialog(!isDeleteDialog)}
        title="콩쿠르 삭제"
        description="이 공고를 삭제할까요? 되돌릴 수 없습니다."
        action={deleteCompetition}
      />
    </div>
  )
}

export default CompetitionDetailContainer
