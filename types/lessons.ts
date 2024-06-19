export type LESSON = {
  id: number;
  name: string;
  pay: number;
  introduction: string;
  career: string;
  phone: string;
  imageUrl: string;
  areas: string[];
  majors: string[];
  authorId: number;
  schools: School[];
};

export enum SchoolType {
  UNDERGRADUATE = "UNDERGRADUATE",
  MASTER = "MASTER",
  DOCTOR = "DOCTOR",
}

export const SchoolTypeValues = {
  UNDERGRADUATE: "대학교",
  MASTER: "대학원 석사",
  DOCTOR: "대학원 박사",
};

export type School = {
  id: number;
  name: string;
  type: SchoolType;
};
