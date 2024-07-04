import { ProfessionalFieldTypes } from "@/types/majors"

export interface LessonsRequest {
  page?: number
  size: number
  keyword?: string
  professionalFields?: ProfessionalFieldTypes[]
  provinceIds?: number[]
}

export interface LessonPayload {
  imageUrl: string
  pay: number
  areas: string[]
  introduction: string
  career?: string
}
