import React from "react"

interface Props {
  title: string
  /** 제목 옆에 작게 보여줄 전체 개수 */
  count?: number
  /** 오른쪽 링크/버튼 (예: + 공고 등록) */
  action?: React.ReactNode
}

/** 목록 페이지 상단 — "채용 370" 처럼 제목과 개수만, 오른쪽에 등록 링크 */
const ListPageHeader = ({ title, count, action }: Props) => {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight text-[#191F28] md:text-[28px]">
        {title}
        {count !== undefined && (
          <span className="ml-1.5 text-[15px] font-medium text-coolgray md:text-[17px]">
            {count.toLocaleString()}
          </span>
        )}
      </h1>
      {action}
    </div>
  )
}

export default ListPageHeader
