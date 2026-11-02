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
