import React from "react"
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
    <Menu>
      <MenuButton className="flex md:hidden" onClick={handleBar}>
        <HamburgerIcon className="w-7 h-7 text-dimgray" />
      </MenuButton>
      <Transition
        show={isBarOpen}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <MenuItems
          anchor="bottom"
          className="bg-white w-screen mt-3 p-4 flex flex-col gap-3 mobile-dropdown shadow-sm"
        >
          {items.map(({ href, label }) => {
            const isActive = pathname.includes(href)
            return (
              <MenuItem key={href}>
                <Link
                  href={href}
                  className={`py-2 font-semibold w-full ${
                    isActive && "text-main"
                  }`}
                >
                  {label}
                </Link>
              </MenuItem>
            )
          })}
          <div className="border-b-[1px] my-4 border-whitesmoke w-full mx-auto" />
          <MenuItem>
            <Link href="/my-profile" className="my-2 font-bold w-full">
              내정보
            </Link>
          </MenuItem>
          <MenuItem>
            {data?.user ? (
              <span className="py-2 font-bold" onClick={handleSign}>
                로그아웃
              </span>
            ) : (
              <Link href="/auth/sign-in" className="py-2 font-bold w-full">
                로그인
              </Link>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default MobileDropDown
