import { SchoolType } from "./lessons"
import { MAJOR } from "./majors"

export type USER = {
  id: number
  name: string
  email: string
  phone?: string
  birth?: string
  nickname: string
  iconImageUrl?: string
  majors?: MAJOR[]
  schools?: SCHOOL[]
  type: UserType
  profile?: string
}

export type SCHOOL = {
  type: SchoolType
  name: string
}

export enum UserType {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
}
