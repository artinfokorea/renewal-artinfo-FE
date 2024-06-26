import React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { USER } from "@/types/users"
import Link from "next/link"

interface Props {
  user: USER
  handleSign: () => void
}

const DeskTopDropDown = ({ user, handleSign }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Avatar>
          <AvatarImage
            src={user?.iconImageUrl || "/img/placeholder-user.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
