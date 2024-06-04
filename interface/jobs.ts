import { RecruitType } from "@/types/jobs";

export interface JobsRequest {
  page: number;
  size: number;
  keyword?: string;
  categoryIds?: number[];
  types?: RecruitType[];
}

export interface PartTimePayload {
  title: string;
  contents: string;
  companyName: string;
  address: string;
  majorId: number;
  startAt: Date;
  endAt: Date;
}

export interface JobPayload {
  title: string;
  contents: string;
  companyName: string;
  imageUrl: string;
  majorIds: number[];
}

export interface ReligionPayload {
  title: string;
  contents: string;
  companyName: string;
  province: string;
  address: string;
  fee: number;
  majorId: number;
}
