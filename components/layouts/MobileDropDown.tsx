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

interface Props {
  items: { href: string; label: string }[]
  isBarOpen: boolean
  handleBar: () => void
  handleSign: () => void
}

const MobileDropDown = ({ isBarOpen, handleBar, items, handleSign }: Props) => {
  const pathname = usePathname()
  const { data } = useSession()

  return (
    <Menu as={Fragment}>
      {({ open }) => (
        <>
          <MenuButton
            className="flex focus:outline-none md:hidden"
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
              {items.map(({ href, label }) => {
                const isActive = pathname.includes(href)
                return (
                  <MenuItem key={href}>
                    <Link
                      href={href}
                      className={`w-full py-2 font-semibold ${
                        isActive && "text-main"
                      }`}
                    >
                      {label}
                    </Link>
                  </MenuItem>
                )
              })}
              <div className="mx-auto my-4 w-full border-b-[1px] border-whitesmoke" />
              <MenuItem>
                <Link href="/my-profile" className="my-2 w-full font-bold">
                  내정보
                </Link>
              </MenuItem>
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
