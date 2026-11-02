"use client"

import React, { useState } from "react"
import { MAJOR } from "@/types/majors"
import DownIcon from "../icons/DownIcon"

interface Props {
  majors?: MAJOR[]
  /** 접힌 상태에서 보여줄 개수 */
  previewCount?: number
}

const Tag = ({ name }: { name: string }) => (
  <span className="inline-flex h-[30px] items-center rounded-lg border border-[#E5E8EB] bg-white px-[11px] text-sm text-[#333D4B]">
    {name}
  </span>
)

/**
 * 채용 상세 "모집 전공".
 * 많을 때는 앞의 몇 개만 보여주고, 더보기를 누르면 분야(클래식·국악…)별로 묶어서 모두 보여준다.
 */
const MajorTagList = ({ majors = [], previewCount = 8 }: Props) => {
  const [expanded, setExpanded] = useState(false)
  if (majors.length === 0) return null

  const collapsible = majors.length > previewCount

  const groups = majors.reduce<{ name: string; items: MAJOR[] }[]>(
    (acc, major) => {
      const name = major.secondGroupKo || "기타"
      const group = acc.find(g => g.name === name)
      if (group) group.items.push(major)
      else acc.push({ name, items: [major] })
      return acc
    },
    [],
  )

  return (
    <section
      aria-labelledby="major-tags-heading"
      className="flex flex-col gap-4 rounded-2xl bg-[#F7F8FA] p-5"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="major-tags-heading" className="text-base font-bold text-[#191F28]">
          모집 전공 <span className="text-main">{majors.length}</span>
        </h2>
        {expanded && groups.length > 1 && (
          <span className="text-[13px] text-[#6B7684]">분야별로 모아 봤어요</span>
        )}
      </div>

      {!collapsible || !expanded ? (
        <div className="flex flex-wrap gap-1.5">
          {majors.slice(0, collapsible ? previewCount : majors.length).map(major => (
            <Tag key={major.id} name={major.koName} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(group => (
            <div key={group.name} className="flex flex-col gap-2">
              <span className="text-[13px] font-bold text-[#4E5968]">
                {group.name} · {group.items.length}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(major => (
                  <Tag key={major.id} name={major.koName} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {collapsible && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="flex h-11 items-center justify-center gap-1 rounded-[10px] bg-white text-sm font-bold text-[#333D4B]"
        >
          {expanded ? "접기" : `전공 ${majors.length - previewCount}개 더보기`}
          <DownIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </section>
  )
}

export default MajorTagList
