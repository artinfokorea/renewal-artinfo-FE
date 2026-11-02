import { DetailApiResponse } from "@/interface"
import { authApiRequest } from "."
import { AdminBreakdown, AdminDaily, AdminOverview } from "@/types/admin"

/* 관리자 지표 — 서버가 users.type = ADMIN 인지 확인한다 (아니면 403) */
export const getAdminOverview = async (): Promise<AdminOverview> => {
  const response =
    await authApiRequest.get<DetailApiResponse<AdminOverview>>(
      "/admin/stats/overview",
    )
  return response.item
}

export const getAdminDaily = async (days: number): Promise<AdminDaily> => {
  const response = await authApiRequest.get<DetailApiResponse<AdminDaily>>(
    "/admin/stats/daily",
    { params: { days } },
  )
  return response.item
}

export const getAdminBreakdown = async (): Promise<AdminBreakdown> => {
  const response =
    await authApiRequest.get<DetailApiResponse<AdminBreakdown>>(
      "/admin/stats/breakdown",
    )
  return response.item
}
