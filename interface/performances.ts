import { ListRequest } from "."
import { PerformanceCategory } from "@/types/performances"

export interface PerformancesRequest extends ListRequest {
  categories: PerformanceCategory[]
  provinceIds?: number[]
}

export interface PerformancePayload {
  category: PerformanceCategory
  title: string
  posterImageUrl: string
  startAt: string
  endAt: string
  time: string
  customAreaName?: string
  areaId?: number
  age: string
  ticketPrice: string
  cast: string
  host: string
  reservationUrl?: string
  introduction: string
}
