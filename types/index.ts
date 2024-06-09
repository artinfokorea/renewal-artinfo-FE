export enum ProvinceEn {
  SEOUL = '서울',
  BUSAN = '부산',
  DAEGU = '대구',
  INCHEON = '인천',
  GWANGJU = '광주',
  DAEJEON = '대전',
  ULSAN = '울산',
  SEJONG = '세종',
  GYEONGGI = '경기',
  GANGWON = '강원',
  CHUNGBUK = '충북',
  CHUNGNAM = '충남',
  JEONBUK = '전북',
  JEONNAM = '전남',
  GYEONGBUK = '경북',
  GYEONGNAM = '경남',
  JEJU = '제주',
}

export enum ProvinceKo {
  SEOUL = 'SEOUL',
  GYEONGGIDO = 'GYEONGGIDO',
  INCHEON = 'INCHEON',
  GANGWONDO = 'GANGWONDO',
  CHUNGCHEONGBUKDO = 'CHUNGCHEONGBUKDO',
  CHUNGCHEONGNAMDO = 'CHUNGCHEONGNAMDO',
  DAEJEON = 'DAEJEON',
  SEJONG = 'SEJONG',
  JEOLLABUKDO = 'JEOLLABUKDO',
  JEOLLANAMDO = 'JEOLLANAMDO',
  GWANGJU = 'GWANGJU',
  GYEONGSANGBUKDO = 'GYEONGSANGBUKDO',
  GYEONGSANGNAMDO = 'GYEONGSANGNAMDO',
  BUSAN = 'BUSAN',
  DAEGU = 'DAEGU',
  ULSAN = 'ULSAN',
  JEJU = 'JEJU',
}

export type PROVINCE = {
  key: ProvinceEn;
  value: ProvinceKo;
};
