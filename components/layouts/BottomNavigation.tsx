"use client"

import React, { useEffect, useState } from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import HomeIcon from "../icons/HomeIcon"
import UserIcon from "../icons/UserIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = [
  {
    title: "홈",
    href: "/",
    icon: HomeIcon,
    prefetch: true,
  },
  {
    title: "채용",
    href: "/jobs",
    icon: NewsPaperIcon,
    prefetch: true,
  },
  {
    title: "레슨",
    href: "/lessons",
    icon: BookIcon,
    prefetch: true,
  },

  {
    title: "내 프로필",
    href: "/my-profile",
    icon: UserIcon,
    prefetch: false,
  },
]

const BottomNavigation = () => {
  const pathname = usePathname()

  return (
    <footer
      className={`fixed md:hidden bottom-0 left-0 w-full z-50 border-t-[1px] h-20 bg-white safe-area`}
    >
      <div className={`h-full grid grid-cols-4 mx-auto mt-2`}>
        {NavItems.map(({ href, title, prefetch, icon }) => {
          const isActive =
            href === "/" ? pathname === href : pathname.startsWith(href)

          return (
            <Link
              href={href}
              key={title}
              prefetch={prefetch}
              className={`flex flex-col items-center h-full text-gray-500 focus:outline-none ${
                isActive ? "text-main" : "text-gray-500"
              }`}
            >
              {icon({
                className: "w-6 h-6 mt-2",
              })}
              <span className="text-sm mt-[2px] font-medium">{title}</span>
            </Link>
          )
        })}
      </div>
    </footer>
  )
}

export default BottomNavigation
