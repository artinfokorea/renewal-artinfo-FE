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
