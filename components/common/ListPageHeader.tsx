import React from "react"

interface Props {
  title: string
  description?: React.ReactNode
  /** 오른쪽 버튼 (예: 공고 등록) */
  action?: React.ReactNode
}

/** 목록 페이지 상단 제목 영역 — 채용·나눔·레슨·공연·뉴스 공용 */
const ListPageHeader = ({ title, description, action }: Props) => {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1 md:gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-[#191F28] md:text-[32px] md:leading-tight">
          {title}
        </h1>
        {description && (
          <p className="break-keep text-sm text-[#6B7684] md:text-[15px]">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export default ListPageHeader
