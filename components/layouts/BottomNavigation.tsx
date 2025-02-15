"use client"

import React, { useEffect, useState } from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import HomeIcon from "../icons/HomeIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import CalendarDaysIcon from "../icons/CalendarDaysIcon"
import { Button, Transition } from "@headlessui/react"
import { HourglassIcon, ScrollTextIcon, Star, UsersIcon } from "lucide-react"
import { JobTimeType } from "@/types/jobs"

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

interface JobMenuProps {
  title: string
  href: string
}

const JobDropDown = ({ title, href }: JobMenuProps) => {
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  useEffect(() => {
    setIsJobMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".job-dropdown")) {
        setIsJobMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <>
      <Button
        onClick={e => {
          e.stopPropagation() // 이벤트 버블링 방지
          setIsJobMenuOpen(!isJobMenuOpen)
        }}
        className={`job-dropdown flex h-full flex-col items-center text-gray-500 focus:outline-none ${
          isActive ? "text-main" : "text-gray-500"
        }`}
      >
        <div className="mt-4 flex flex-col items-center gap-[2px]">
          <BriefcaseIcon className="h-5 w-5" />
          <span className="mt-[2px] text-xs font-medium">{title}</span>
        </div>
      </Button>

      <Transition
        show={isJobMenuOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-[72px] left-[20%] z-50 flex flex-col gap-2 rounded border bg-white p-2">
          <Link href={`/jobs?jobTimeType=${JobTimeType.FULL_TIME}`}>
            <div className="flex items-center gap-2 p-2">
              <ScrollTextIcon className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">정규</span>
            </div>
          </Link>

          {/* <Link href={`/jobs?jobTimeType=${JobTimeType.PART_TIME}`}>
            <div className="flex items-center gap-2 p-2">
              <HourglassIcon className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">단기</span>
            </div>
          </Link> */}
          <Link href={`/jobs?jobTimeType=${JobTimeType.AMATEUR}`}>
            <div className="flex items-center gap-2 p-2">
              <UsersIcon className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">아마추어</span>
            </div>
          </Link>
          <Link href={`/jobs?jobTimeType=${JobTimeType.YOUTH}`}>
            <div className="flex items-center gap-2 p-2">
              <Star className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">
                소년 ∙ 소녀
              </span>
            </div>
          </Link>
        </div>
      </Transition>
    </>
  )
}

const BottomNavigation = () => {
  return (
    <footer
      className={`safe-area fixed bottom-0 left-0 z-50 h-20 w-full border-t-[1px] bg-white lg:hidden`}
    >
      <div className={`mx-auto grid h-full grid-cols-5`}>
        <NavMenu title="홈" href="/" icon={HomeIcon} />
        <JobDropDown title="채용" href="/jobs" />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="뉴스" href="/news" icon={NewsPaperIcon} />
      </div>
    </footer>
  )
}

export default BottomNavigation
