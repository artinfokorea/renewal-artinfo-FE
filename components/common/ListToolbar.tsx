"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SearchBar from "./SearchBar"
import CloseIcon from "../icons/CloseIcon"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  /** URL 파라미터 이름 (예: provinceId, recruit) */
  param: string
  name: string
  options: FilterOption[]
  /** API 가 값 하나만 받는 경우 */
  single?: boolean
}

interface Props {
  searchPlaceholder: string
  groups?: FilterGroup[]
}

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
)

/**
 * 목록 페이지 공용 도구줄: 검색창 + 필터 버튼.
 * 필터는 데스크톱에서는 아래로 펼치는 패널, 모바일에서는 하단 시트로 열린다.
 * 선택한 필터는 검색창 아래에 지울 수 있는 칩으로 남는다. 상태는 모두 URL 파라미터.
 */
const ListToolbar = ({ searchPlaceholder, groups = [] }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // 모바일 시트가 열려 있을 때 뒤 페이지 스크롤을 막는다
  useEffect(() => {
    if (!open) return
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    if (!isMobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const selected = (param: string) => searchParams.getAll(param)

  const push = (params: URLSearchParams) => {
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const toggle = (group: FilterGroup, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(group.param)
    params.delete(group.param)
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : group.single
        ? [value]
        : [...current, value]
    next.forEach(v => params.append(group.param, v))
    push(params)
  }

  const reset = () => {
    const params = new URLSearchParams(searchParams.toString())
    groups.forEach(group => params.delete(group.param))
    push(params)
  }

  const pills = groups.flatMap(group =>
    selected(group.param)
      .map(value => {
        const option = group.options.find(o => o.value === value)
        return option ? { group, option } : null
      })
      .filter((pill): pill is { group: FilterGroup; option: FilterOption } => !!pill),
  )

  const groupList = (
    <div className="flex flex-col gap-5">
      {groups.map(group => (
        <div key={group.param} className="flex flex-col gap-2.5">
          <span className="text-[13px] font-bold text-[#6B7684]">{group.name}</span>
          <div className="flex flex-wrap gap-1.5">
            {group.options.map(option => {
              const active = selected(group.param).includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(group, option.value)}
                  className={`h-9 rounded-full border px-3.5 text-sm transition-colors ${
                    active
                      ? "border-main bg-[#E8F3FF] font-bold text-main"
                      : "border-[#E5E8EB] bg-white text-[#4E5968] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="mt-5 md:mt-6">
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <SearchBar placeholder={searchPlaceholder} />
        </div>
        {groups.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-label={pills.length ? `필터 ${pills.length}개 선택됨` : "필터"}
            onClick={() => setOpen(!open)}
            className={`relative flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl border bg-white text-[15px] md:h-[52px] md:px-[18px] ${
              pills.length
                ? "border-[#191F28] font-bold text-[#191F28]"
                : "border-[#E5E8EB] text-[#4E5968]"
            } w-12 md:w-auto`}
          >
            <FilterIcon className="h-[18px] w-[18px]" />
            <span className="hidden md:inline">
              필터{pills.length ? ` ${pills.length}` : ""}
            </span>
            {pills.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-main px-1 text-[11px] font-bold text-white md:hidden">
                {pills.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* 데스크톱: 아래로 펼치는 패널 */}
      {open && (
        <div className="mt-3 hidden flex-col gap-4 rounded-2xl border border-[#E5E8EB] p-5 md:flex">
          {groupList}
          <div className="flex justify-end gap-2 border-t border-[#F2F4F6] pt-3">
            <button
              type="button"
              onClick={reset}
              className="h-10 px-4 text-sm text-[#6B7684]"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 rounded-[10px] bg-[#191F28] px-5 text-sm font-bold text-white"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 모바일: 하단 시트 */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end md:hidden">
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={() => setOpen(false)}
            className="flex-1 bg-black/40"
          />
          <div
            role="dialog"
            aria-label="필터"
            className="flex max-h-[75vh] flex-col gap-4 rounded-t-[20px] bg-white px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3"
          >
            <div className="mx-auto h-1 w-9 rounded-full bg-[#E5E8EB]" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#191F28]">필터</span>
              <button
                type="button"
                onClick={reset}
                className="h-9 text-sm text-[#6B7684]"
              >
                초기화
              </button>
            </div>
            <div className="overflow-y-auto">{groupList}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-[52px] shrink-0 rounded-[14px] bg-main text-base font-bold text-white"
            >
              결과 보기
            </button>
          </div>
        </div>
      )}

      {pills.length > 0 && !open && (
        <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          {pills.map(({ group, option }) => (
            <button
              key={`${group.param}-${option.value}`}
              type="button"
              aria-label={`${option.label} 필터 해제`}
              onClick={() => toggle(group, option.value)}
              className="inline-flex h-[30px] shrink-0 items-center gap-1 rounded-full bg-[#F2F4F6] pl-3 pr-2 text-[13px] text-[#333D4B]"
            >
              {option.label}
              <CloseIcon className="h-3.5 w-3.5 text-coolgray" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListToolbar
