import { DetailApiResponse, SuccessResponse } from "@/interface"
import { authApiRequest } from "."
import {
  AdminBreakdown,
  AdminDaily,
  AdminEngagement,
  AdminOverview,
  AdminUsers,
  AdminUsersParams,
  AdminUsersSummary,
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

/* ---------- 회원 관리 ---------- */

export const getAdminUsersSummary = async (): Promise<AdminUsersSummary> => {
  const response = await authApiRequest.get<
    DetailApiResponse<AdminUsersSummary>
  >("/admin/users/summary")
  return response.item
}

/* 회원 목록 — 필터·검색·페이지네이션 (가입 최신순) */
export const getAdminUsers = async (
  params: AdminUsersParams,
): Promise<AdminUsers> => {
  const response = await authApiRequest.get<DetailApiResponse<AdminUsers>>(
    "/admin/users",
    {
      params: {
        filter: params.filter,
        q: params.q || undefined,
        page: params.page,
        size: params.size,
      },
    },
  )
  return response.item
}

/* 역할 변경 (ADMIN ↔ CLIENT) — 자기 자신은 서버가 거절 */
export const updateAdminUserType = (id: number, type: "ADMIN" | "CLIENT") =>
  authApiRequest.put<SuccessResponse>(`/admin/users/${id}/type`, { type })

/* 탈퇴 처리 — 익명화 + soft delete + 푸시 토큰 삭제. 자기 자신·관리자는 서버가 거절 */
export const withdrawAdminUser = (id: number) =>
  authApiRequest.delete<SuccessResponse>(`/admin/users/${id}`)
