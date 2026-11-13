export interface CountWithRecent {
  total: number
  last7d: number
  last30d: number
}

export interface AdminOverview {
  users: CountWithRecent
  activeUsers: CountWithRecent
  jobs: CountWithRecent
  activeJobs: number
  posts: CountWithRecent
  comments: CountWithRecent
  lessons: number
  performances: number
  upcomingPerformances: number
  news: number
  inquiries: CountWithRecent
}

export interface AdminDailyPoint {
  date: string
  signups: number
  activeUsers: number
  jobs: number
  posts: number
  comments: number
}

export type AdminDailyMetric = Exclude<keyof AdminDailyPoint, "date">

export interface AdminDaily {
  days: number
  points: AdminDailyPoint[]
}

export interface AdminBreakdown {
  loginsByType: { type: string; count: number }[]
  jobsByType: { type: string; count: number }[]
  recentUsers: {
    id: number
    nickname: string
    email: string
    createdAt: string
  }[]
  topPosts: {
    id: number
    title: string
    viewCount: number
    createdAt: string
  }[]
  recentInquiries: {
    id: number
    title: string
    email: string
    createdAt: string
  }[]
}

export interface AdminEngagement {
  summary: {
    /** 오늘 방문자 (비회원 포함) */
    dau: number
    wau: number
    mau: number
    memberDau: number
    memberWau: number
    memberMau: number
    /** 최근 7일, 방문자 1명이 하루에 머문 평균 초 */
    avgSeconds7d: number
  }
  days: number
  daily: {
    date: string
    visitors: number
    members: number
    avgSeconds: number
  }[]
  /** 첫 방문 주별 1~4주차 재방문 비율(%) — 측정 전이면 null */
  retention: { cohort: string; size: number; weeks: (number | null)[] }[]
}

export interface AdminVisitor {
  visitorId: string
  nickname: string | null
  firstSeenAt: string
  lastSeenAt: string
  activeSeconds: number
  pageViews: number
  sessions: number
  device: string
  os: string
  browser: string
  userAgent: string | null
  referrerHost: string | null
  landingPath: string | null
  /** 마지막으로 본 페이지 (이탈 페이지) */
  exitPath: string | null
  /** 그날 거친 페이지 경로 (순서대로, 최대 200개) */
  paths: string[]
  engaged: boolean
}

export interface AdminVisitors {
  day: string
  total: number
  visitors: AdminVisitor[]
}

/* ---------- 회원 관리 ---------- */

export type AdminUserFilter =
  | "all"
  | "app"
  | "web"
  | "push_on"
  | "push_off"
  | "admin"
  | "withdrawn"

export interface AdminUsersSummary {
  /** 회원 (탈퇴·관리자 제외) */
  members: number
  membersLast7d: number
  admins: number
  withdrawn: number
  /** 앱 설치 회원 (푸시 토큰 1개 이상) */
  appUsers: number
  appUsersLast7d: number
  appUsersIos: number
  appUsersAndroid: number
  /** 채용 알림 켠 / 끈 앱 회원 */
  pushOn: number
  pushOff: number
  /** 등록된 기기(토큰) 수 */
  devices: number
}

export interface AdminUser {
  id: number
  type: "ADMIN" | "CLIENT"
  name: string
  nickname: string
  /** 마스킹된 이메일 */
  email: string
  /** 마스킹된 전화번호 */
  phone: string | null
  createdAt: string
  deletedAt: string | null
  lastLoginAt: string | null
  loginTypes: string[]
  hasApp: boolean
  deviceCount: number
  platforms: string[]
  appInstalledAt: string | null
  pushJob: boolean
}

export interface AdminUsersParams {
  filter: AdminUserFilter
  q: string
  page: number
  size: number
}

export interface AdminUsers {
  total: number
  page: number
  size: number
  totalPages: number
  filter: string
  query: string | null
  users: AdminUser[]
}
