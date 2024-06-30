import { JobType, ProfessionalFieldTypes } from "@/types/jobs"

export interface JobsRequest {
  page?: number
  size: number
  keyword?: string
  professionalFields?: ProfessionalFieldTypes[]
  types?: JobType[]
  provinceIds?: number[]
}

export interface PartTimePayload {
  title: string
  contents: string
  companyName: string
  address: string
  majorId: number
  startAt: Date
  endAt: Date
  fee: number
}

export interface JobPayload {
  title: string
  contents: string
  companyName: string
  address: string
  imageUrl: string
  majorIds?: number[]
}

export interface ReligionPayload {
  title: string
  contents: string
  companyName: string

  address: string
  fee: number
  majorId: number
}
