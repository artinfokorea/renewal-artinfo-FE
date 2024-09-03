export type PERFORMANCE = {
  id: number
  title: string
  posterImageUrl: string
  startAt: Date
  endAt: Date
}

export type PERFORMANCE_DETAIL = {
  customAreaName: string
  authorId: number
  area?: AREA
  time: string
  age: string
  ticketPrice: string
  cast: string
  host: string
  reservationUrl: string
  introduction: string
} & PERFORMANCE

export enum PerformanceCategory {
  CLASSIC = "CLASSIC",
  MUSICAL = "MUSICAL",
  DANCE = "DANCE",
  TRADITIONAL_MUSIC = "TRADITIONAL_MUSIC",
}

export const PerformanceCategoryValues = {
  CLASSIC: "클래식",
  MUSICAL: "뮤지컬",
  DANCE: "댄스",
  TRADITIONAL_MUSIC: "국악",
} as const

export const PerformanceCategoryList = Object.values(PerformanceCategory)

export type AREA = {
  name: string
  seatScale: number
  type: string
  address: string
  latitude: number
  longitude: number
  siteUrl: string
}

export type PERFORMANCE_AREA = {
  id: number
  name: string
  address: string
}
