export enum ProfessionalFieldTypes {
  CLASSIC = "CLASSIC",
  POPULAR_MUSIC = "POPULAR_MUSIC",
  TRADITIONAL_MUSIC = "TRADITIONAL_MUSIC",
  ADMINISTRATION = "ADMINISTRATION",
}

export enum ArtType {
  MUSIC = "MUSIC",
  ART = "ART",
}

export type MajorGroup = {
  nameKo: string
  nameEn: string
}

export type ArtField = {
  nameKo: string
  nameEn: ProfessionalFieldTypes
}

export type MAJOR = {
  id: number
  firstGroupKo: string
  firstGroupEn: ArtType
  secondGroupKo: string
  secondGroupEn: ProfessionalFieldTypes
  koName: string
  enName: string
}

export const MajorCategoryValues = [
  {
    key: ProfessionalFieldTypes.CLASSIC,
    value: "클래식",
  },
  {
    key: ProfessionalFieldTypes.POPULAR_MUSIC,
    value: "실용음악",
  },
  {
    key: ProfessionalFieldTypes.TRADITIONAL_MUSIC,
    value: "국악",
  },
  {
    key: ProfessionalFieldTypes.ADMINISTRATION,
    value: "사무",
  },
]
