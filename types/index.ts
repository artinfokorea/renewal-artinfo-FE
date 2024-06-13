export enum ProvinceEn {
  SEOUL = "서울",
  BUSAN = "부산",
  DAEGU = "대구",
  INCHEON = "인천",
  GWANGJU = "광주",
  DAEJEON = "대전",
  ULSAN = "울산",
  SEJONG = "세종",
  GYEONGGI = "경기",
  GANGWON = "강원",
  CHUNGBUK = "충북",
  CHUNGNAM = "충남",
  JEONBUK = "전북",
  JEONNAM = "전남",
  GYEONGBUK = "경북",
  GYEONGNAM = "경남",
  JEJU = "제주",
}

export enum ProvinceKo {
  SEOUL = "SEOUL",
  GYEONGGIDO = "GYEONGGIDO",
  INCHEON = "INCHEON",
  GANGWONDO = "GANGWONDO",
  CHUNGCHEONGBUKDO = "CHUNGCHEONGBUKDO",
  CHUNGCHEONGNAMDO = "CHUNGCHEONGNAMDO",
  DAEJEON = "DAEJEON",
  SEJONG = "SEJONG",
  JEOLLABUKDO = "JEOLLABUKDO",
  JEOLLANAMDO = "JEOLLANAMDO",
  GWANGJU = "GWANGJU",
  GYEONGSANGBUKDO = "GYEONGSANGBUKDO",
  GYEONGSANGNAMDO = "GYEONGSANGNAMDO",
  BUSAN = "BUSAN",
  DAEGU = "DAEGU",
  ULSAN = "ULSAN",
  JEJU = "JEJU",
}

export type PROVINCE = {
  key: ProvinceEn;
  value: ProvinceKo;
};

export enum MajorEnum {
  CONDUCTOR = "CONDUCTOR",
  COMPOSER = "COMPOSER",
  PERCUSSION = "PERCUSSION",
  PIANO = "PIANO",
  ORGAN = "ORGAN",
  PLANNING = "PLANNING",
  ADVERTISEMENT = "ADVERTISEMENT",
  MANAGEMENT = "MANAGEMENT",
  ETC = "ETC",
  SOPRANO = "SOPRANO",
  MEZZO_SOPRANO = "MEZZO_SOPRANO",
  ALTO = "ALTO",
  TENOR = "TENOR",
  BARITONE = "BARITONE",
  BASS = "BASS",
  VIOLIN = "VIOLIN",
  VIOLA = "VIOLA",
  CELLO = "CELLO",
  DOUBLE_BASE = "DOUBLE_BASE",
  HARP = "HARP",
  FLUTE = "FLUTE",
  OBOE = "OBOE",
  CLARINET = "CLARINET",
  BASSOON = "BASSOON",
  HORN = "HORN",
  TRUMPET = "TRUMPET",
  TROMBONE = "TROMBONE",
  TUBA = "TUBA",
  ELECTRIC_GUITAR = "ELECTRIC_GUITAR",
  BASS_GUITAR = "BASS_GUITAR",
  DRUM = "DRUM",
  VOCAL = "VOCAL",
  ACOUSTIC_GUITAR = "ACOUSTIC_GUITAR",
  MIDI = "MIDI",
  GAYAGEUM = "GAYAGEUM",
  GEOMUNGO = "GEOMUNGO",
  AJAENG = "AJAENG",
  HAEGEUM = "HAEGEUM",
  DAEGEUM = "DAEGEUM",
  SOGEUM = "SOGEUM",
  DANSO = "DANSO",
  PEERI = "PEERI",
  TAEPYEONGSO = "TAEPYEONGSO",
  SAMULNORI = "SAMULNORI",
  JANGGU = "JANGGU",
  PANSORI = "PANSORI",
  MINYO = "MINYO",
}

export enum MajorCategory {
  MUSIC_MAJOR_ETC = "MUSIC_MAJOR_ETC",
  MUSIC_MAJOR_KEYBOARD = "MUSIC_MAJOR_KEYBOARD",
  MUSIC_MAJOR_ADMINISTRATION = "MUSIC_MAJOR_ADMINISTRATION",
  MUSIC_MAJOR_VOCAL = "MUSIC_MAJOR_VOCAL",
  MUSIC_MAJOR_STRING = "MUSIC_MAJOR_STRING",
  MUSIC_MAJOR_BRASS = "MUSIC_MAJOR_BRASS",
  MUSIC_MAJOR_POPULAR_MUSIC = "MUSIC_MAJOR_POPULAR_MUSIC",
  MUSIC_MAJOR_TRADITIONAL_MUSIC = "MUSIC_MAJOR_TRADITIONAL_MUSIC",
}

export const MajorCategoryValues = [
  {
    key: MajorCategory.MUSIC_MAJOR_VOCAL,
    value: "성악",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_STRING,
    value: "현악기",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_BRASS,
    value: "관악기",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_ETC,
    value: "기타",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_KEYBOARD,
    value: "행정",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_ADMINISTRATION,
    value: "관리",
  },

  {
    key: MajorCategory.MUSIC_MAJOR_POPULAR_MUSIC,
    value: "실욤음악",
  },
  {
    key: MajorCategory.MUSIC_MAJOR_TRADITIONAL_MUSIC,
    value: "국악",
  },
];

export type MAJOR = {
  id: number;
  koGroup: string;
  enGroup: MajorCategory;
  koName: string;
  enName: MajorEnum;
};

export type IMAGE = {
  id: number;
  target: string;
  originalFilename: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
  url: string;
};
