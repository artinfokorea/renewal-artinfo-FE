import NewsCreateContainer from "@/components/containers/news/NewsCreateContainer"
import { getUser } from "@/lib/serverUserFetch"
import { UserType } from "@/types/users"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const user = await getUser()

  if (user.type === UserType.CLIENT) {
    redirect("/news")
  }

  return (
    <section className="mx-auto max-w-screen-lg">
      <NewsCreateContainer />
    </section>
  )
}

export default page
