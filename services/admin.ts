import { DetailApiResponse } from "@/interface"
import { authApiRequest } from "."
import {
  AdminBreakdown,
  AdminDaily,
  AdminEngagement,
  AdminOverview,
  AdminVisitors,
} from "@/types/admin"

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

/* 방문자(비회원 포함) DAU·WAU·MAU, 일별 방문·체류, 주간 리텐션 */
export const getAdminEngagement = async (
  days: number,
): Promise<AdminEngagement> => {
  const response = await authApiRequest.get<
    DetailApiResponse<AdminEngagement>
  >("/admin/stats/engagement", { params: { days } })
  return response.item
}

/* 그날 방문자 목록 (50명씩) */
export const getAdminVisitors = async (
  day: string,
  offset: number,
): Promise<AdminVisitors> => {
  const response = await authApiRequest.get<DetailApiResponse<AdminVisitors>>(
    "/admin/stats/visitors",
    { params: { day, offset } },
  )
  return response.item
}
