import { Schedule } from "@/interface/jobs"
import { MAJOR } from "./majors"

export enum JobType {
  ART_ORGANIZATION = "ART_ORGANIZATION",
  PART_TIME = "PART_TIME",
  RELIGION = "RELIGION",
  LECTURER = "LECTURER",
}

export enum MajorType {
  ALL = "ALL",
  VOCAL = "VOCAL",
  SOPRANO = "SOPRANO",
  MEZZO_SOPRANO = "MEZZO_SOPRANO",
  ALTO = "ALTO",
  TENOR = "TENOR",
  BARITONE = "BARITONE",
  BASS = "BASS",
  INSTRUMENT = "INSTRUMENT",
  WIND = "WIND",
  GUITAR = "GUITAR",
  ADMINISTRATION = "ADMINISTRATION",
  APPLIED_MUSIC = "APPLIED_MUSIC",
  TRADITIONAL_MUSIC = "TRADITIONAL_MUSIC",
  PIANO = "PIANO",
  ORGAN = "ORGAN",
}

export const JobTypeList = [
  {
    title: "예술단체",
    value: JobType.ART_ORGANIZATION,
  },
  {
    title: "종교",
    value: JobType.RELIGION,
  },
  {
    title: "대학 · 학원",
    value: JobType.LECTURER,
  },
]

export const JobTypeValues: { [key in JobType]: string } = JobTypeList.reduce<{
  [key in JobType]: string
}>(
  (acc, curr) => {
    acc[curr.value] = curr.title
    return acc
  },
  {} as { [key in JobType]: string },
)

export const MajorValues = [
  {
    title: "전체",
    value: MajorType.ALL,
  },
  {
    title: "성악",
    value: MajorType.VOCAL,
  },
  {
    title: "소프라노",
    value: MajorType.SOPRANO,
    deps: 2,
  },
  { title: "메조 소프라노", value: MajorType.MEZZO_SOPRANO, deps: 2 },
  { title: "알토", value: MajorType.ALTO, deps: 2 },
  { title: "테너", value: MajorType.TENOR, deps: 2 },
  { title: "바리톤", value: MajorType.BARITONE, deps: 2 },
  { title: "베이스", value: MajorType.BASS, deps: 2 },
  { title: "현악기", value: MajorType.INSTRUMENT },
  { title: "관악기", value: MajorType.WIND },
  { title: "기타", value: MajorType.GUITAR },
  { title: "행정", value: MajorType.ADMINISTRATION },
  { title: "실용음악", value: MajorType.APPLIED_MUSIC },
  { title: "국악", value: MajorType.TRADITIONAL_MUSIC },
]

export type JOB = {
  id: number
  title: string
  contents: string
  province: string
  imageUrl: string
  majors: { majors: MAJOR[] }
  type: JobType
  isActive: true
  fee: number
  authorId: number
  startAt: Date
  endAt: Date
  createdAt: Date
  companyName: string
  address?: string
  addressDetail?: string
  recruitSiteUrl?: string
  schedules?: Schedule[]
}

export enum SearchType {
  REGION = "REGION",
  MAJOR = "MAJOR",
  RECRUIT = "RECRUIT",
  CATEGORY = "CATEGORY",
}

export enum PartTimeMajor {
  CONDUCTOR = "CONDUCTOR",
  KEYBOARD = "KEYBOARD",
  STRING = "STRING",
  WOOD_WIND = "WOOD_WIND",
  PERCUSSION = "PERCUSSION",
  BRASS_WIND = "BRASS_WIND",
  VOCAL = "VOCAL",
  COMPOSER = "COMPOSER",
}

export const PartTimeMajorValues = {
  [PartTimeMajor.CONDUCTOR]: "지휘",
  [PartTimeMajor.KEYBOARD]: "건반악기",
  [PartTimeMajor.STRING]: "현악기",
  [PartTimeMajor.WOOD_WIND]: "목관악기",
  [PartTimeMajor.PERCUSSION]: "타악기",
  [PartTimeMajor.BRASS_WIND]: "금관악기",
  [PartTimeMajor.VOCAL]: "성악",
  [PartTimeMajor.COMPOSER]: "작곡",
}

export interface ApplyJob {
  id: number
  title: string
  isActive: boolean
  appliedAt: Date
}

export enum JobTimeType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
}
