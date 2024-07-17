export enum ProfessionalFieldTypes {
  CLASSIC = "CLASSIC",
  POPULAR_MUSIC = "POPULAR_MUSIC",
  TRADITIONAL_MUSIC = "TRADITIONAL_MUSIC",
  ADMINISTRATION = "ADMINISTRATION",
  ART = "ART",
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
