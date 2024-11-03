"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const ProfileLinkItem = ({
  href,
  active,
  title,
}: {
  href: string
  active: boolean
  title: string
}) => {
  return (
    <li>
      <Link
        href={href}
        className={`my-4 text-lg font-semibold ${active && "text-main"}`}
      >
        {title}
      </Link>
    </li>
  )
}

export const ProfileSideBar = () => {
  const pathname = usePathname()
  return (
    <div className="hidden w-[300px] flex-col gap-4 whitespace-nowrap border-r-2 border-whitesmoke p-4 md:flex md:p-8">
      <ul className="flex flex-col gap-4">
        <ProfileLinkItem
          href="/my-profile"
          active={pathname === "/my-profile"}
          title="프로필"
        />
        <ProfileLinkItem
          href="/my-activities"
          active={pathname === "/my-activities"}
          title="내 활동"
        />
      </ul>
    </div>
  )
}
