import ProfileContainer from "@/components/containers/profile/ProfileContainer"
import React from "react"
import GetQueryClient from "@/lib/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { getUser } from "@/lib/serverUserFetch"

const page = async () => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["users", "me"],
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
