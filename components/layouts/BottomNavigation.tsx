"use client"

import React from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import HomeIcon from "../icons/HomeIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import UserIcon from "../icons/UserIcon"
import InformationIcon from "../icons/InformationIcon"
import { useSession } from "next-auth/react"
import CalendarDaysIcon from "../icons/CalendarDaysIcon"

interface NavMenuProps {
  title: string
  href: string
  prefetch?: boolean
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}

const NavMenu = ({ title, href, prefetch = true, icon }: NavMenuProps) => {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`flex h-full flex-col items-center text-gray-500 focus:outline-none ${
        isActive ? "text-main" : "text-gray-500"
      }`}
    >
      <div className="mt-4 flex flex-col items-center gap-[2px]">
        {icon({
          className: "w-5 h-5",
        })}
        <span className="mt-[2px] text-xs font-medium">{title}</span>
      </div>
    </Link>
  )
}

const BottomNavigation = () => {
  const pathname = usePathname()
  const { data } = useSession()

  return (
    <footer
      className={`safe-area fixed bottom-0 left-0 z-50 h-20 w-full border-t-[1px] bg-white md:hidden`}
    >
      <div className={`mx-auto grid h-full grid-cols-5`}>
        <NavMenu title="홈" href="/" icon={HomeIcon} />
        <NavMenu title="채용" href="/jobs" icon={BriefcaseIcon} />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
        <NavMenu title="뉴스" href="/news" icon={NewsPaperIcon} />

        {/* {data?.user ? (
          <Link
            href="/my-profile"
            className={`flex h-full flex-col items-center text-gray-500 focus:outline-none ${
              pathname.startsWith("/my-profile") ? "text-main" : "text-gray-500"
            }`}
          >
            <div className="mt-4 flex flex-col items-center gap-[2px]">
              <UserIcon className="h-5 w-5" />
              <span className="mt-[2px] text-xs font-medium">내 정보</span>
            </div>
          </Link>
        ) : (
          <Link
            href="/inquiry"
            className={`flex h-full flex-col items-center text-gray-500 focus:outline-none ${
              pathname.startsWith("/inquiry") ? "text-main" : "text-gray-500"
            }`}
          >
            <div className="mt-4 flex flex-col items-center gap-[2px]">
              <InformationIcon className="h-5 w-5" />
              <span className="mt-[2px] text-xs font-medium">문의</span>
            </div>
          </Link>
        )} */}
      </div>
    </footer>
  )
}

export default BottomNavigation
