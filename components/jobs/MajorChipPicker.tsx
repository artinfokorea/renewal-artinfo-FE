"use client"

import React, { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { MAJOR } from "@/types/majors"

interface Props {
  selected: MAJOR[]
  onToggle: (major: MAJOR) => void
}

/**
 * 모집 전공 선택 — 팝업 없이 폼 안에서 바로 고른다.
 * 전공이 57개라 분류(클래식·실용음악·국악·미술·사무) 탭으로 나누고, 고른 전공은 탭과 무관하게 위에 모아 보여 준다.
 */
const MajorChipPicker = ({ selected, onToggle }: Props) => {
  const { data } = useQuery(queries.majors.list())
  const majors = useMemo(() => data?.majors ?? [], [data])
  const groups = useMemo(() => {
    const map = new Map<string, MAJOR[]>()
    majors.forEach(major => {
      const list = map.get(major.secondGroupKo) ?? []
      list.push(major)
      map.set(major.secondGroupKo, list)
    })
    return Array.from(map.entries())
  }, [majors])
  const [group, setGroup] = useState<string | null>(null)
  const activeGroup = group ?? groups[0]?.[0] ?? null
  const selectedIds = new Set(selected.map(major => major.id))

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <ul aria-label="선택한 전공" className="flex flex-wrap gap-2">
          {selected.map(major => (
            <li key={major.id}>
              <button
                type="button"
                onClick={() => onToggle(major)}
                aria-label={`${major.koName} 빼기`}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-main bg-[#E8F3FF] px-3.5 text-[14px] font-bold text-[#1B64DA]"
              >
                {major.koName}
                <span aria-hidden className="text-[16px] leading-none">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#F7F8FA] p-1 [scrollbar-width:none]">
        {groups.map(([name, list]) => {
          const picked = list.filter(major => selectedIds.has(major.id)).length
          const on = name === activeGroup
          return (
            <button
              key={name}
              type="button"
              onClick={() => setGroup(name)}
              className={`h-9 shrink-0 rounded-lg px-3 text-[13px] font-semibold ${on ? "bg-white text-[#191F28] shadow-sm" : "text-[#6B7684]"}`}
            >
              {name}
              {picked > 0 && <span className="ml-1 text-[12px] text-[#1B64DA]">{picked}</span>}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        {(groups.find(([name]) => name === activeGroup)?.[1] ?? []).map(major => {
          const on = selectedIds.has(major.id)
          return (
            <button
              key={major.id}
              type="button"
              onClick={() => onToggle(major)}
              aria-pressed={on}
              className={`h-9 rounded-full border px-3.5 text-[14px] ${on ? "border-main bg-[#E8F3FF] font-bold text-[#1B64DA]" : "border-[#E5E8EB] text-[#4E5968]"}`}
            >
              {major.koName}
            </button>
          )
        })}
        {majors.length === 0 && <span className="text-[13px] text-[#8B95A1]">전공 목록을 불러오는 중…</span>}
      </div>
    </div>
  )
}

export default MajorChipPicker
