"use client"

import React from "react"
import NewsPaperIcon from "../icons/NewsPaperIcon"
import BookIcon from "../icons/BookIcon"
import HomeIcon from "../icons/HomeIcon"
import UserIcon from "../icons/UserIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import InformationIcon from "../icons/InformationIcon"

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
]

const BottomNavigation = () => {
  const pathname = usePathname()
  const { data } = useSession()

  return (
    <footer
      className={`fixed md:hidden bottom-0 left-0 w-full z-50 border-t-[1px] h-20 bg-white safe-area`}
    >
      <div className={`h-full grid grid-cols-4 mx-auto`}>
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
              <div className="flex flex-col gap-[2px] items-center mt-4">
                {icon({
                  className: "w-5 h-5",
                })}
                <span className="text-xs mt-[2px] font-medium">{title}</span>
              </div>
            </Link>
          )
        })}
        {data?.user ? (
          <Link
            href="/my-profile"
            className={`flex flex-col items-center h-full text-gray-500 focus:outline-none ${
              pathname.startsWith("/my-profile") ? "text-main" : "text-gray-500"
            }`}
          >
            <div className="flex flex-col gap-[2px] items-center mt-4">
              <UserIcon className="w-5 h-5" />
              <span className="text-xs mt-[2px] font-medium">내 정보</span>
            </div>
          </Link>
        ) : (
          <Link
            href="/inquiry"
            className={`flex flex-col items-center h-full text-gray-500 focus:outline-none ${
              pathname.startsWith("/inquiry") ? "text-main" : "text-gray-500"
            }`}
          >
            <div className="flex flex-col gap-[2px] items-center mt-4">
              <InformationIcon className="w-5 h-5" />
              <span className="text-xs mt-[2px] font-medium">문의</span>
            </div>
          </Link>
        )}
      </div>
    </footer>
  )
}

export default BottomNavigation
