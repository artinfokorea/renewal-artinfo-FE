"use client"

import React from "react"

interface Props {
  label: string
  onClick: () => void
}

/** 목록 페이지 제목 옆 등록 링크 — "+ 공고 등록" */
const CreateButton = ({ label, onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 py-2.5 text-sm font-bold text-main hover:underline md:text-[15px]"
    >
      + {label}
    </button>
  )
}

export default CreateButton
