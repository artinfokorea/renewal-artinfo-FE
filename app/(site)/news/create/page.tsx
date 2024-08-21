import NewsCreateContainer from "@/components/news/NewsCreateContainer"
import GetQueryClient from "@/lib/GetQueryClient"
import { queries } from "@/lib/queries"
import { getUser } from "@/lib/serverUserFetch"
import { UserType } from "@/types/users"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const queryClient = GetQueryClient()

  const user = await queryClient.fetchQuery({
    queryKey: queries.users.detail().queryKey,
    queryFn: getUser,
  })

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
