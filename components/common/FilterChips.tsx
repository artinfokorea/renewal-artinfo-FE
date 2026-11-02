"use client"

import React from "react"

export interface FilterOption {
  label: string
  value: string
}

interface Props {
  label: string
  options: FilterOption[]
  /** 선택된 값들 (비어 있으면 "전체") */
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  allLabel?: string
  /** 앞에 붙일 요소 (예: 모바일 필터 버튼) */
  leading?: React.ReactNode
}

/**
 * 가로 칩 필터. 모바일은 한 줄 가로 스크롤, 데스크톱은 줄바꿈.
 * 여러 개를 고를 수 있고, "전체" 는 선택을 모두 해제한다.
 */
const FilterChips = ({
  label,
  options,
  selected,
  onToggle,
  onClear,
  allLabel = "전체",
  leading,
}: Props) => {
  const chip = (text: string, active: boolean, onClick: () => void, key: string) => (
    <button
      key={key}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
        active
          ? "border-[#191F28] bg-[#191F28] text-white"
          : "border-[#E5E8EB] bg-white text-[#4E5968] hover:bg-[#F7F8FA]"
      }`}
    >
      {text}
    </button>
  )

  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {leading}
      {chip(allLabel, selected.length === 0, onClear, "__all")}
      {options.map(option =>
        chip(
          option.label,
          selected.includes(option.value),
          () => onToggle(option.value),
          option.value,
        ),
      )}
    </div>
  )
}

export default FilterChips
