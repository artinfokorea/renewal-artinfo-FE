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
  recentUsers: { id: number; nickname: string; email: string; createdAt: string }[]
  topPosts: { id: number; title: string; viewCount: number; createdAt: string }[]
  recentInquiries: { id: number; title: string; email: string; createdAt: string }[]
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
  daily: { date: string; visitors: number; members: number; avgSeconds: number }[]
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
  engaged: boolean
}

export interface AdminVisitors {
  day: string
  total: number
  visitors: AdminVisitor[]
}
