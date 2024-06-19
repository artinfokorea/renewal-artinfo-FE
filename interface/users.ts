import { SCHOOL } from "@/types/users";

export interface UserPayload {
  phone?: string;
  iconImageUrl?: string;
  birth?: string;
  majorIds?: number[];
  schools?: SCHOOL[];
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  nickname: string;
}
