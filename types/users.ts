import { MAJOR } from ".";
import { SchoolType } from "./lessons";

export type USER = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birth?: string;
  nickname: string;
  iconImageUrl?: string;
  majors?: MAJOR[];
  schools?: SCHOOL[];
};

export type SCHOOL = {
  type: SchoolType;
  name: string;
};
