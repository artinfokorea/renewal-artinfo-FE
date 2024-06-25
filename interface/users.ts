import { SCHOOL } from "@/types/users";

export interface UserPayload {
  phone?: string;
  iconImageUrl?: string;
  birth?: string;
  majorIds?: number[];
  schools?: SCHOOL[];
  name?: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  nickname: string;
}
