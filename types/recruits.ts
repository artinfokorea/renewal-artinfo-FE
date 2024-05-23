export enum RecruitType {
  ORCHESTRA = "ORCHESTRA",
  OBRI = "OBRI",
  RELIGION = "RELIGION",
  LECTURE = "LECTURE",
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
}

export const recruitsValues = [
  {
    title: "연주단체",
    value: RecruitType.ORCHESTRA,
  },
  {
    title: "오브리",
    value: RecruitType.OBRI,
  },
  {
    title: "종교",
    value: RecruitType.RELIGION,
  },
  {
    title: "강사",
    value: RecruitType.LECTURE,
  },
];

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
];