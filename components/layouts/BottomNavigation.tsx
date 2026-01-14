"use client"

import React, { useState } from "react"
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
import { JobDropDown } from "./JobDropdown"
import { CommunityDropDown } from "./CommunityDropDown"

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
      className={`flex h-full flex-col items-center justify-center text-gray-500 focus:outline-none ${
        isActive ? "text-main" : "text-gray-500"
      }`}
    >
      <div className="flex flex-col items-center gap-[2px]">
        {icon({
          className: "w-5 h-5",
        })}
        <span className="mt-[2px] text-xs font-medium">{title}</span>
      </div>
    </Link>
  )
}

const BottomNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState({
    job: false,
    community: false,
  })

  const handleMenuOpen = (menu: "job" | "community") => {
    setIsMenuOpen({
      job: menu === "job" ? !isMenuOpen.job : false,
      community: menu === "community" ? !isMenuOpen.community : false,
    })
  }

  const allMenuClose = () => {
    setIsMenuOpen({
      job: false,
      community: false,
    })
  }

  return (
    <footer
      className={`safe-area fixed-bottom-nav left-0 z-50 h-20 w-full border-t-[1px] bg-white lg:hidden`}
    >
      <div className={`mx-auto grid h-full grid-cols-5`}>
        <NavMenu title="홈" href="/" icon={HomeIcon} />
        <JobDropDown
          title="채용"
          href="/jobs"
          isMenuOpen={isMenuOpen.job}
          handleMenuOpen={handleMenuOpen}
          allMenuClose={allMenuClose}
        />
        <CommunityDropDown
          title="소통"
          isMenuOpen={isMenuOpen.community}
          handleMenuOpen={handleMenuOpen}
          allMenuClose={allMenuClose}
        />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
      </div>
    </footer>
  )
}

export default BottomNavigation
