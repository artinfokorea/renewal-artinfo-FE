import { SCHOOL } from "@/types/users";

export interface UserPayload {
  phone?: string;
  iconImageUrl?: string;
  birth?: string;
  majorIds?: number[];
  schools?: SCHOOL[];
}
