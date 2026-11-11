/** 접수 상태 — 서버가 한국 날짜 기준으로 계산해 내려준다 (SOON 은 접수중 가운데 마감 7일 이내) */
export type CompetitionPhase = "UPCOMING" | "OPEN" | "SOON" | "JUDGING" | "CLOSED"
export type CompetitionStatus = "REVIEW" | "PUBLISHED" | "HIDDEN"
export type ApplyMethod = "LINK" | "EMAIL" | "POST" | "CONTACT"

export const PHASE_LABEL: Record<CompetitionPhase, string> = {
  UPCOMING: "접수예정",
  OPEN: "접수중",
  SOON: "마감임박",
  JUDGING: "심사중",
  CLOSED: "종료",
}

/** 필터 시트의 상태 옵션 (순서 = 노출 순서). OPEN 을 고르면 서버가 SOON 도 포함한다 */
export const PHASE_OPTIONS: { label: string; value: CompetitionPhase }[] = [
  { label: "접수중", value: "OPEN" },
  { label: "마감임박", value: "SOON" },
  { label: "접수예정", value: "UPCOMING" },
  { label: "심사중", value: "JUDGING" },
  { label: "지난 대회", value: "CLOSED" },
]

export const COMPETITION_DIVISIONS = ["피아노", "성악", "현악", "관악", "작곡", "실용음악", "종합"]
export const COMPETITION_AGES = ["초등", "중등", "고등", "대학·일반"]
export const COMPETITION_AREAS = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
  "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "전국",
]

export const APPLY_METHOD_LABEL: Record<ApplyMethod, string> = {
  LINK: "주최 홈페이지·접수 폼",
  EMAIL: "이메일 접수",
  POST: "우편·방문 접수",
  CONTACT: "전화 등 주최에 직접 문의",
}

/** 포스터가 없을 때 부문별 바탕색 */
export const DIVISION_COLOR: Record<string, string> = {
  피아노: "#2F3B52",
  성악: "#8A3B5C",
  현악: "#A0622B",
  관악: "#2E6B5A",
  작곡: "#5B4B8A",
  실용음악: "#1F6F8B",
  종합: "#3E4C7A",
}

export type COMPETITION = {
  id: number
  title: string
  host: string
  organizer: string | null
  area: string
  venue: string | null
  divisions: string[]
  ages: string[]
  openAt: string
  closeAt: string
  heldAt: string | null
  resultAt: string | null
  fee: string | null
  applyMethod: ApplyMethod
  applyLink: string | null
  tel: string | null
  email: string | null
  prize: string | null
  description: string | null
  posterUrl: string | null
  documentUrl: string | null
  /** 본문 이미지 (포스터와 별개, 여러 장) */
  contentImages: string[]
  source: "OWNER" | "CRAWL"
  status: CompetitionStatus
  authorId: number | null
  verified: boolean
  viewCount: number
  phase: CompetitionPhase
  /** 마감까지 남은 날 (음수면 지남) */
  dDay: number
  /** 접수 시작까지 남은 날 */
  openIn: number
  createdAt: string
}
