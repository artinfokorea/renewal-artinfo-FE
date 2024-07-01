import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { USER } from "@/types/users"
import Link from "next/link"
import Image from "next/image"

interface Props {
  user: USER
  handleSign: () => void
}

const DeskTopDropDown = ({ user, handleSign }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Image
          src={user.iconImageUrl || "/img/placeholder-user.png"}
          alt="user-icon-image"
          width={40}
          height={40}
        />
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
