import { SCHOOL } from '@/types/users';

export interface UserPayload {
  phone: string;
  iconImageUrl: string;
  birth: Date;
  majorIds: number[];
  schools: SCHOOL[];
}
