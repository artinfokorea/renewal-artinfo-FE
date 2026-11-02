"use client"

import React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import DownIcon from "../icons/DownIcon"
import { FilterOption } from "./FilterChips"

interface Props {
  label: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

/** "유형 전체 ▾" 형태의 다중 선택 드롭다운 필터 */
const FilterDropdown = ({ label, options, selected, onToggle, onClear }: Props) => {
  const summary =
    selected.length === 0
      ? `${label} 전체`
      : selected.length === 1
        ? options.find(o => o.value === selected[0])?.label ?? label
        : `${label} ${selected.length}`

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3.5 text-sm ${
            selected.length > 0
              ? "border-[#191F28] font-bold text-[#191F28]"
              : "border-[#E5E8EB] text-[#4E5968]"
          } bg-white`}
        >
          {summary}
          <DownIcon className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl p-1.5">
        <DropdownMenuCheckboxItem
          checked={selected.length === 0}
          onSelect={e => e.preventDefault()}
          onCheckedChange={onClear}
          className="rounded-lg py-2 text-sm"
        >
          전체
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onSelect={e => e.preventDefault()}
            onCheckedChange={() => onToggle(option.value)}
            className="rounded-lg py-2 text-sm"
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterDropdown
