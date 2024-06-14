import { getAds } from "@/apis/ad";
import { getInfiniteJobs, getJob, getJobs } from "@/apis/jobs";
import { getMajors, getProvinces } from "@/apis/system";
import { JobsRequest } from "@/interface/jobs";
import { AdvertisementType } from "@/types/ads";
import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

export const ads = createQueryKeys("ads", {
  list: (type: AdvertisementType) => ({
    queryKey: [type],
    queryFn: () => getAds(type),
  }),
});

export const majors = createQueryKeys("majors", {
  list: () => ({
    queryKey: [""],
    queryFn: () => getMajors(),
  }),
});

export const provinces = createQueryKeys("provinces", {
  list: (depth?: number) => ({
    queryKey: [depth],
    queryFn: () => getProvinces(depth),
  }),
});

export const jobs = createQueryKeys("jobs", {
  detail: (JobId: number) => ({
    queryKey: [JobId],
    queryFn: () => getJob(JobId),
  }),
  list: (filters: JobsRequest) => ({
    queryKey: ["list", { filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: JobsRequest) => ({
    queryKey: ["infiniteList", { filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteJobs({ ...filters, page: pageParam }),
  }),
});

export const queries = mergeQueryKeys(ads, jobs, majors, provinces);
