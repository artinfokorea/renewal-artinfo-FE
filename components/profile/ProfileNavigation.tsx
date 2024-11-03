"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const NavItem = ({
  href,
  title,
  isActive,
}: {
  href: string
  title: string
  isActive: boolean
}) => {
  return (
    <Link href={href}>
      <li
        className={`relative pb-2 ${
          isActive
            ? "text-main after:absolute after:bottom-[-2px] after:left-0 after:w-full after:border-b-2 after:border-main"
            : ""
        }`}
      >
        {title}
      </li>
    </Link>
  )
}

export const ProfileNavigation = () => {
  const pathname = usePathname()

  return (
    <nav className="flex md:hidden">
      <ul className="flex w-full gap-4 border-b-2 text-xl font-semibold">
        <NavItem
          href="/my-profile"
          title="프로필"
          isActive={pathname === "/my-profile"}
        />
        <NavItem
          href="/my-activities"
          title="내 활동"
          isActive={pathname === "/my-activities"}
        />
      </ul>
    </nav>
  )
}
