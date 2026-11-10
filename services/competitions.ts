import { COMPETITION } from "@/types/competitions"
import { publicApiRequest, authApiRequest } from "."
import axios from "axios"

/** 서버가 보낸 메시지(검증 실패 등)를 그대로 쓴다 — 없으면 기본 문구 */
const competitionError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string | string[] } | undefined)?.message
    if (Array.isArray(message) && message.length) return message.join("\n")
    if (typeof message === "string" && message.trim()) return message
    if (error.response?.status === 401) return "로그인이 필요합니다."
    if (error.response?.status === 403) return "이 공고를 수정하거나 삭제할 권한이 없습니다."
    if (error.response?.status === 404) return "공고를 찾을 수 없습니다."
  }
  return fallback
}
import {
  DetailApiResponse,
  ListApiResponse,
  ListResponse,
  ScrollApiResponse,
  SuccessResponse,
} from "@/interface"
import { CompetitionPayload, CompetitionsRequest } from "@/interface/competitions"

const toParams = (request: CompetitionsRequest) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(request)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v.toString()))
    } else if (value) {
      params.append(key, value.toString())
    }
  }
  return params
}

/* 콩쿠르 목록 (마감임박순, phases 비우면 종료 제외) */
export const getCompetitions = async (
  request: CompetitionsRequest,
): Promise<ListResponse<COMPETITION, "competitions">> => {
  try {
    const response = await publicApiRequest.get<
      ListApiResponse<COMPETITION, "competitions">
    >("/competitions", { params: toParams(request) })
    return response.item
  } catch (error) {
    throw new Error(competitionError(error, "콩쿠르 목록을 불러오지 못했습니다."))
  }
}

/* 콩쿠르 스크롤 목록 */
export const getInfiniteCompetitions = async (
  request: CompetitionsRequest,
): Promise<ScrollApiResponse<COMPETITION, "competitions">> => {
  const response = await getCompetitions(request)
  return {
    competitions: response.competitions,
    nextPage: request.page ? request.page + 1 : 2,
    isLast: response.competitions.length < request.size,
    totalCount: response.totalCount ?? 0,
  }
}

/**
 * 콩쿠르 상세. 브라우저에서는 토큰을 같이 보내 '검토 중'인 내 공고도 볼 수 있게 하고,
 * 서버 렌더링(토큰 없음)에서는 게시된 공고만 받는다.
 */
export const getCompetition = async (id: number): Promise<COMPETITION> => {
  try {
    const client = typeof window === "undefined" ? publicApiRequest : authApiRequest
    const response = await client.get<DetailApiResponse<COMPETITION>>(
      `/competitions/${id}`,
    )
    return response.item
  } catch (error) {
    throw new Error(competitionError(error, "공고를 불러오지 못했습니다."))
  }
}

/* 콩쿠르 등록 — 회원은 검토 후 게시(REVIEW), 관리자는 즉시 게시 */
export const createCompetition = async (
  payload: CompetitionPayload,
): Promise<{ id: number; status: "REVIEW" | "PUBLISHED" }> => {
  try {
    const response = await authApiRequest.post<
      DetailApiResponse<{ id: number; status: "REVIEW" | "PUBLISHED" }>
    >("/competitions", payload)
    return response.item
  } catch (error) {
    throw new Error(competitionError(error, "등록에 실패했습니다. 입력을 확인해 주세요."))
  }
}

export const updateCompetition = async (
  id: number,
  payload: CompetitionPayload,
): Promise<SuccessResponse> => {
  try {
    return await authApiRequest.put<SuccessResponse>(`/competitions/${id}`, payload)
  } catch (error) {
    throw new Error(competitionError(error, "수정에 실패했습니다. 입력을 확인해 주세요."))
  }
}

export const deleteCompetition = async (id: number): Promise<SuccessResponse> => {
  try {
    return await authApiRequest.delete<SuccessResponse>(`/competitions/${id}`)
  } catch (error) {
    throw new Error(competitionError(error, "삭제에 실패했습니다."))
  }
}
