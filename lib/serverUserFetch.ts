import { cookies } from "next/headers"
import { USER } from "@/types/users"
import { DetailApiResponse } from "@/interface"
import { getServerSession } from "next-auth"
import { authOptions } from "./authOptions"
import { redirect } from "next/navigation"

export const getUser = async (): Promise<USER> => {
  const session = await getServerSession(authOptions)

  if (!session) return redirect("/auth/sign-in")

  const res = await fetch(`${process.env.REST_API_BASE_URL!}/users/me`, {
    headers: {
      Authorization: `Bearer ${session.token.accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const data: DetailApiResponse<USER> = await res.json()
  return data.item
}
