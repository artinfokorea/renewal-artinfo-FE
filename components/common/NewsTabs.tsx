"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const TABS = [
  { href: "/posts", label: "나눔" },
  { href: "/competitions", label: "콩쿠르", isNew: true },
  { href: "/news", label: "뉴스" },
]

/**
 * 모바일 '소식' 탭 안의 상단 탭 — 나눔 · 콩쿠르 · 뉴스 (앱의 소식 탭과 같은 구성).
 * 데스크톱은 상단 메뉴가 따로 있으므로 숨긴다.
 */
const NewsTabs = () => {
  const pathname = usePathname()
  return (
    <nav aria-label="소식" className="-mx-4 mb-4 flex border-b border-[#E5E8EB] lg:hidden">
      {TABS.map(tab => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px flex h-11 flex-1 items-center justify-center gap-1 border-b-2 text-[15px] ${
              active
                ? "border-main font-bold text-[#191F28]"
                : "border-transparent font-semibold text-[#6B7684]"
            }`}
          >
            {tab.label}
            {tab.isNew && !active && (
              <span className="-mt-2 h-1.5 w-1.5 rounded-full bg-main" aria-label="새 메뉴" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default NewsTabs
