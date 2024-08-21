import React from "react"
import GetQueryClient from "@/lib/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getUser } from "@/lib/serverUserFetch"
import ProfileContainer from "@/components/profile/ProfileContainer"
import { queries } from "@/lib/queries"

const page = async () => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: queries.users.detail().queryKey,
    queryFn: getUser,
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileContainer />
    </HydrationBoundary>
  )
}

export default page
