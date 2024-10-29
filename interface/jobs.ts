import { JobType, MajorGroupTypes } from "@/types/jobs"
import { ProfessionalFieldTypes } from "@/types/majors"
import { ListRequest } from "."

export interface JobsRequest extends ListRequest {
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
}

export interface JobPayload {
  title: string
  contents: string
  companyName: string
  address: string
  addressDetail: string
  imageUrl?: string
  majorIds?: number[]
  type: JobType
  recruitSiteUrl?: string
}

export interface PartTimeCreatePayload {
  title: string
  contents: string
  companyName: string
  address: string
  addressDetail: string
  fee: number
  majorIds?: number[]
  schedules?: Schedule[]
}

export interface PartTimeUpdatePayload extends PartTimeCreatePayload {
  isActive: boolean
}

export interface PartTimeJobRequest extends ListRequest {
  majorGroups?: MajorGroupTypes[]
  provinces?: number[]
}

export interface Schedule {
  startAt: Date
  endAt: Date
}
