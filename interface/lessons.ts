import { ProfessionalFieldTypes } from "@/types/majors"
import { ListRequest } from "."

export interface LessonsRequest extends ListRequest {
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
