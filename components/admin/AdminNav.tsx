"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ITEMS = [
  { href: "/admin", label: "지표" },
  { href: "/admin/users", label: "회원 관리" },
] as const

/** 관리자 상단 탭 — 지표 대시보드 · 회원 관리 */
const AdminNav = () => {
  const pathname = usePathname()
  return (
    <nav aria-label="관리자 메뉴" className="mt-5 flex gap-1 border-b border-[#EEF0F3]">
      {ITEMS.map(item => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-semibold ${
              active ? "border-[#191F28] text-[#191F28]" : "border-transparent text-[#8B95A1] hover:text-[#4E5968]"
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default AdminNav
