"use client"

import React, { useEffect, useState } from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import HomeIcon from "../icons/HomeIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import CalendarDaysIcon from "../icons/CalendarDaysIcon"

const StarIcon = ({ className = "size-6" }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
import { Button, Transition } from "@headlessui/react"
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
      className={`safe-area fixed bottom-0 left-0 z-50 h-20 w-full border-t-[1px] bg-white lg:hidden`}
    >
      <div className={`mx-auto grid h-full grid-cols-5`}>
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
        <NavMenu title="기획" href="/performance-inquiry" icon={StarIcon} />
        <NavMenu title="레슨" href="/lessons" icon={BookIcon} />
        <NavMenu title="공연" href="/performances" icon={CalendarDaysIcon} />
      </div>
    </footer>
  )
}

export default BottomNavigation
