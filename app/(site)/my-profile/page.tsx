import ProfileContainer from "@/components/profile/ProfileContainer"
import React from "react"
import GetQueryClient from "@/app/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { USER } from "@/types/users"
import { DetailApiResponse } from "@/interface"

const getUser = async (): Promise<USER> => {
  const accessToken = cookies().get("accessToken")?.value
  if (!accessToken) throw new Error("Access token not found")

  const res = await fetch(`${process.env.REST_API_BASE_URL!}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const data: DetailApiResponse<USER> = await res.json()
  return data.item
}

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
