import { cookies } from "next/headers"
import { USER } from "@/types/users"
import { DetailApiResponse } from "@/interface"

export const getUser = async (): Promise<USER> => {
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
