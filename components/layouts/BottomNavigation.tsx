"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Send } from "lucide-react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import CalendarDaysIcon from "../icons/CalendarDaysIcon"

interface NavMenuProps {
  title: string
  href: string
  prefetch?: boolean
  icon: React.ComponentType<{ className?: string }>
}

const NavMenu = ({
  title,
  href,
  prefetch = true,
  icon: Icon,
}: NavMenuProps) => {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`flex h-full flex-col items-center justify-center text-gray-500 focus:outline-none ${
        isActive ? "text-main" : "text-gray-500"
      }`}
    >
      <div className="flex flex-col items-center gap-[2px]">
        <Icon className="h-5 w-5" />
        <span className="mt-[2px] text-xs font-medium">{title}</span>
      </div>
    </Link>
  )
}

/**
 * 모바일 하단 네비게이션: 채용 · 뉴스 · 나눔 · 레슨 · 공연
 * (기획 페이지가 없어지면서 소통 드롭다운의 나눔을 기획 자리로 꺼냈다)
 */
const BottomNavigation = () => {
  return (
    <footer
      className={`safe-area fixed-bottom-nav left-0 z-50 h-20 w-full border-t-[1px] bg-white lg:hidden`}
    >
      <div className={`mx-auto grid h-full grid-cols-5`}>
        <NavMenu title="채용" href="/jobs" icon={BriefcaseIcon} />
        <NavMenu title="뉴스" href="/news" icon={NewsPaperIcon} />
        <NavMenu title="나눔" href="/posts" icon={Send} />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
      </div>
    </footer>
  )
}

export default BottomNavigation
