export type PERFORMANCE = {
  id: number
  title: string
  posterImageUrl: string
  startAt: Date
  endAt: Date
}

export enum PerformanceCategory {
  CLASSIC = "CLASSIC",
  MUSICAL = "MUSICAL",
  DANCE = "DANCE",
  TRADITIONAL_MUSIC = "TRADITIONAL_MUSIC",
}
