"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import HomeIcon from "../icons/HomeIcon"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import CalendarDaysIcon from "../icons/CalendarDaysIcon"

interface NavMenuProps {
  title: string
  href: string
  /** 이 경로들 중 하나로 시작하면 활성 (기본은 href) */
  activePaths?: string[]
  prefetch?: boolean
  icon: React.ComponentType<{ className?: string }>
}

const NavMenu = ({ title, href, activePaths, prefetch = true, icon: Icon }: NavMenuProps) => {
  const pathname = usePathname()
  const paths = activePaths ?? [href]
  const isActive = href === "/" ? pathname === href : paths.some(path => pathname.startsWith(path))

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`flex h-full flex-col items-center justify-center focus:outline-none ${isActive ? "text-main" : "text-gray-500"}`}
    >
      <div className="flex flex-col items-center gap-[2px]">
        <Icon className="h-5 w-5" />
        <span className="mt-[2px] text-xs font-medium">{title}</span>
      </div>
    </Link>
  )
}

/**
 * 모바일 하단 네비게이션 — 앱과 같은 구성: 홈 · 채용 · 소식(나눔·콩쿠르·뉴스) · 레슨 · 공연.
 * 소식은 나눔으로 들어가고, 각 페이지 상단의 NewsTabs 로 나눔·콩쿠르·뉴스를 오간다.
 */
const BottomNavigation = () => {
  return (
    <footer className="safe-area fixed-bottom-nav left-0 z-50 h-20 w-full border-t-[1px] bg-white lg:hidden">
      <div className="mx-auto grid h-full grid-cols-5">
        <NavMenu title="홈" href="/" icon={HomeIcon} />
        <NavMenu title="채용" href="/jobs" icon={BriefcaseIcon} />
        <NavMenu title="소식" href="/posts" activePaths={["/posts", "/competitions", "/news"]} icon={NewsPaperIcon} />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
      </div>
    </footer>
  )
}

export default BottomNavigation
