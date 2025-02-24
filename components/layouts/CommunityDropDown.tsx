"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollTextIcon } from "lucide-react"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import { Transition } from "@headlessui/react"
import Link from "next/link"
import NewsPaperIcon from "../icons/NewsPaperIcon"

interface CommunityDropDownProps {
  title: string
  isMenuOpen: boolean
  handleMenuOpen: (menu: "job" | "community") => void
  allMenuClose: () => void
}

export const CommunityDropDown = ({
  title,
  isMenuOpen,
  handleMenuOpen,
  allMenuClose,
}: CommunityDropDownProps) => {
  const pathname = usePathname()
  const isActive = pathname.startsWith("/posts") || pathname.startsWith("/news")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".job-dropdown")) {
        allMenuClose()
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
          handleMenuOpen("community")
        }}
        className={`job-dropdown flex h-full flex-col items-center text-gray-500 focus:outline-none ${
          isActive ? "text-main" : "text-gray-500"
        }`}
      >
        <div className="flex flex-col items-center gap-[2px]">
          <BriefcaseIcon className="h-5 w-5" />
          <span className="mt-[2px] text-xs font-medium">{title}</span>
        </div>
      </Button>

      <Transition
        show={isMenuOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute bottom-[72px] left-[40%] z-50 flex min-w-[100px] flex-col gap-2 rounded border bg-white p-2">
          <Link href="/posts">
            <div className="flex items-center gap-2 p-2">
              <ScrollTextIcon className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">나눔</span>
            </div>
          </Link>

          <Link href="/news">
            <div className="flex items-center gap-2 p-2">
              <NewsPaperIcon className="h-5 w-5 text-gray-700" />
              <span className="pt-[2px] text-sm text-gray-700">뉴스</span>
            </div>
          </Link>
        </div>
      </Transition>
    </>
  )
}
