import React from "react"

interface Props {
  label: string
  value?: number
  /** 보조 줄 (예: 최근 7일 +12) */
  sub?: React.ReactNode
}

const format = (n?: number) => (n === undefined ? "–" : n.toLocaleString())

/** 관리자 대시보드 숫자 타일 */
const StatTile = ({ label, value, sub }: Props) => (
  <div className="flex flex-col gap-1.5 rounded-2xl border border-[#EEF0F3] bg-white p-4 md:p-5">
    <span className="text-[13px] font-medium text-[#6B7684]">{label}</span>
    <span className="text-2xl font-bold tabular-nums tracking-tight text-[#191F28] md:text-[28px]">
      {format(value)}
    </span>
    {sub && <span className="text-[13px] text-[#6B7684]">{sub}</span>}
  </div>
)

export const RecentDelta = ({ last7d, last30d }: { last7d?: number; last30d?: number }) => (
  <>
    7일 <strong className="font-semibold text-[#333D4B]">+{format(last7d)}</strong>
    <span className="mx-1.5 text-[#D1D6DB]">·</span>
    30일 <strong className="font-semibold text-[#333D4B]">+{format(last30d)}</strong>
  </>
)

export default StatTile
