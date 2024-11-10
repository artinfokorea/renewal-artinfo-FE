import React, { Fragment } from "react"
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react"
import HamburgerIcon from "../icons/HamburgerIcon"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { JobTimeType } from "@/types/jobs"

interface Props {
  isBarOpen: boolean
  handleBar: () => void
  handleSign: () => void
}

const DropDownMenu = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname()
  const isActive = pathname.includes(href)

  return (
    <MenuItem>
      <Link
        href={href}
        className={`w-full py-2 font-semibold ${isActive && "text-main"}`}
      >
        {label}
      </Link>
    </MenuItem>
  )
}

const MobileDropDown = ({ handleBar, handleSign }: Props) => {
  const { data } = useSession()

  return (
    <Menu as={Fragment}>
      {({ open }) => (
        <>
          <MenuButton
            className="flex focus:outline-none lg:hidden"
            onClick={handleBar}
          >
            <HamburgerIcon className="h-7 w-7 text-dimgray" />
          </MenuButton>
          <Transition
            show={open}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <MenuItems
              static
              className="mobile-dropdown absolute -left-3 top-8 z-30 mt-3 flex w-screen flex-col gap-3 bg-white p-4 shadow-sm focus:outline-none"
            >
              <DropDownMenu
                href={`/jobs?jobTimeType=${JobTimeType.FULL_TIME}`}
                label="채용"
              />
              <DropDownMenu href="/performances" label="공연" />
              <DropDownMenu href="/lessons" label="레슨" />
              <DropDownMenu href="/news" label="뉴스" />
              <DropDownMenu href="/inquiry" label="문의" />
              <div className="mx-auto my-4 w-full border-b-[1px] border-whitesmoke" />
              <DropDownMenu href="/my-profile" label="내 정보" />
              <DropDownMenu href="/my-activities" label="내 활동" />

              <MenuItem>
                {data?.user ? (
                  <span
                    className="cursor-pointer py-2 font-bold"
                    onClick={handleSign}
                  >
                    로그아웃
                  </span>
                ) : (
                  <Link href="/auth/sign-in" className="w-full py-2 font-bold">
                    로그인
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default MobileDropDown
