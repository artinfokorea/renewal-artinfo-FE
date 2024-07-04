import ProfileContainer from "@/components/profile/ProfileContainer"
import React from "react"
import GetQueryClient from "@/app/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { USER } from "@/types/users"
import { DetailApiResponse } from "@/interface"

const getUser = async (): Promise<DetailApiResponse<USER>> => {
  const res = await fetch(`${process.env.REST_API_BASE_URL!}/users/me`, {
    headers: {
      Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

const page = async () => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["users", "me"],
    queryFn: () => getUser().then(res => res.item),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileContainer />
    </HydrationBoundary>
  )
}

export default page
