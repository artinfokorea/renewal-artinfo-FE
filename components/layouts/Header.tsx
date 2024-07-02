"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "../ui/button"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import MobileDropDown from "./MobileDropDown"
import DeskTopDropDown from "./DeskTopDropDown"

export const NavItems = [
  {
    href: "/jobs",
    label: "채용",
  },
  {
    href: "/lessons",
    label: "레슨",
  },
  {
    href: "/inquiry",
    label: "문의",
  },
]

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data } = useSession()
  const [isTopScroll, setIsTopScroll] = useState(true)
  const [isBarOpen, setIsBarOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0
      setIsTopScroll(isTop)
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsBarOpen(false)
  }, [scrollY, pathname])

  const handleSign = () => {
    if (data?.user) {
      signOut({ callbackUrl: "/auth/sign-in" })
    } else {
      router.push("/auth/sign-in")
    }
  }

  return (
    <header
      className={`sticky top-0 left-0 z-50 h-14 py-3 px-4 bg-white ${
        (!isTopScroll || isBarOpen) && "shadow-md"
      }
      `}
    >
      <div className="max-w-screen-lg flex justify-between items-center mx-auto relative">
        <div className="flex">
          <Link href="/">
            <h1 className="font-bold text-2xl text-main">ARTINFO</h1>
          </Link>
          <NavigationMenu className="ml-12 hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                {NavItems.map(({ href, label }) => {
                  const isActive = pathname.includes(href)
                  return (
                    <Link
                      href={href}
                      key={href}
                      className={`mx-3 font-semibold ${
                        isActive && "text-main"
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden md:flex">
          {user ? (
            <DeskTopDropDown user={user} handleSign={handleSign} />
          ) : (
            <Button
              className="bg-white text-main border-main border text-sm h-8 hover:bg-white"
              onClick={handleSign}
            >
              로그인
            </Button>
          )}
        </div>
        <MobileDropDown
          isBarOpen={isBarOpen}
          handleBar={() => setIsBarOpen(!isBarOpen)}
          items={NavItems}
          handleSign={handleSign}
        />
      </div>
    </header>
  )
}

export default Header
