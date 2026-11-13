"use client"

import React from "react"

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

/** 현재 페이지 앞뒤로 최대 5개의 번호 + 처음/끝 */
const pageNumbers = (page: number, totalPages: number) => {
  const span = 2
  let start = Math.max(1, page - span)
  const end = Math.min(totalPages, start + span * 2)
  start = Math.max(1, end - span * 2)
  const pages: number[] = []
  for (let i = start; i <= end; i += 1) pages.push(i)
  return pages
}

const PageButton = ({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
  label?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-current={active ? "page" : undefined}
    className={`h-8 min-w-8 rounded-lg px-2 text-[13px] tabular-nums disabled:cursor-not-allowed disabled:opacity-40 ${
      active ? "bg-[#191F28] font-bold text-white" : "text-[#4E5968] hover:bg-[#F2F4F6]"
    }`}
  >
    {children}
  </button>
)

/** 관리자 목록 페이지네이션 (1부터) */
const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null
  const pages = pageNumbers(page, totalPages)
  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-1">
      <PageButton onClick={() => onChange(1)} disabled={page === 1} label="첫 페이지">
        «
      </PageButton>
      <PageButton onClick={() => onChange(page - 1)} disabled={page === 1} label="이전 페이지">
        ‹
      </PageButton>
      {pages[0] > 1 && <span className="px-1 text-[13px] text-[#B0B8C1]">…</span>}
      {pages.map(p => (
        <PageButton key={p} onClick={() => onChange(p)} active={p === page}>
          {p}
        </PageButton>
      ))}
      {pages[pages.length - 1] < totalPages && <span className="px-1 text-[13px] text-[#B0B8C1]">…</span>}
      <PageButton onClick={() => onChange(page + 1)} disabled={page === totalPages} label="다음 페이지">
        ›
      </PageButton>
      <PageButton onClick={() => onChange(totalPages)} disabled={page === totalPages} label="마지막 페이지">
        »
      </PageButton>
    </nav>
  )
}

export default Pagination
