"use client"

import React from "react"
import PlusIcon from "../icons/PlusIcon"

interface Props {
  label: string
  onClick: () => void
}

/** 목록 페이지 제목 옆 등록 버튼 — 모바일은 연한 버튼, 데스크톱은 파란 버튼 */
const CreateButton = ({ label, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[#E8F3FF] px-3.5 text-sm font-bold text-[#1B64DA] md:h-11 md:rounded-[10px] md:bg-main md:px-5 md:text-[15px] md:text-white"
    >
      <PlusIcon className="hidden h-4 w-4 md:block" />
      {label}
    </button>
  )
}

export default CreateButton
