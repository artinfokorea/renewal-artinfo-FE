export type LESSON = {
  id: number;
  name: string;
  pay: number;
  introduction: string;
  career: string;
  phone: string;
  imageUrl: string;
  provinces: string[];
  majors: string[];
  schools: School[];
};

enum SchoolType {
  UNDERGRADUATE = "UNDERGRADUATE",
  MASTER = "MASTER",
  DOCTOR = "DOCTOR",
}

type School = {
  id: number;
  name: string;
  type: SchoolType;
};
