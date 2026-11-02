import React from "react"

interface Props {
  title: string
  /** 오른쪽 링크/버튼 (예: + 공고 등록) */
  action?: React.ReactNode
}

/** 목록 페이지 상단 — 제목과 오른쪽 등록 링크 */
const ListPageHeader = ({ title, action }: Props) => {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-[#191F28] md:text-[28px]">
        {title}
      </h1>
      {action}
    </div>
  )
}

export default ListPageHeader
