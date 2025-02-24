"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Transition } from "@headlessui/react"
import Link from "next/link"
import { ScrollTextIcon, UsersIcon, Star } from "lucide-react"
import { JobTimeType } from "@/types/jobs"
import BriefcaseIcon from "../icons/BriefcaseIcon"
import { usePathname } from "next/navigation"

interface JobMenuProps {
  title: string
  href: string
  isMenuOpen: boolean
  handleMenuOpen: (menu: "job" | "community") => void
  allMenuClose: () => void
}

export const JobDropDown = ({
  title,
  href,
  isMenuOpen,
  handleMenuOpen,
  allMenuClose,
}: JobMenuProps) => {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  useEffect(() => {
    allMenuClose()
  }, [pathname])

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
          handleMenuOpen("job")
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
