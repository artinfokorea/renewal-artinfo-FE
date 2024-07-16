import { getUser } from "@/lib/serverUserFetch"
import { UserType } from "@/types/users"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const user = await getUser()

  if (user.type === UserType.CLIENT) {
    redirect("/news")
  }

  return <div>create</div>
}

export default page
