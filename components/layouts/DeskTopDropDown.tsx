import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { USER } from "@/types/users"
import Link from "next/link"
import FallbackImage from "../common/FallbackImage"

interface Props {
  user: USER
  handleSign: () => void
}

const DeskTopDropDown = ({ user, handleSign }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center focus:outline-none">
        <div className="relative h-8 w-8">
          <FallbackImage
            src={user.iconImageUrl || ""}
            alt="user_profile_image"
            fill
            sizes="150px"
            unoptimized
            className="rounded-full"
          />
        </div>
        <span className="mx-2 hidden md:block">{user?.nickname}님</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/my-profile" prefetch={false}>
          <DropdownMenuItem className="cursor-pointer hover:bg-whitesmoke">
            내 프로필
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={handleSign}
          className="cursor-pointer hover:bg-whitesmoke"
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DeskTopDropDown
