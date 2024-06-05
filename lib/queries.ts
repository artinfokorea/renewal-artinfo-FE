import { getAds } from "@/apis/ad";
import { getJob, getJobs } from "@/apis/jobs";
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

export const jobs = createQueryKeys("jobs", {
  detail: (JobId: number) => ({
    queryKey: [JobId],
    queryFn: () => getJob(JobId),
  }),
  list: (filters: JobsRequest) => ({
    queryKey: [{ filters }],
    queryFn: () => getJobs(filters),
  }),
});

export const queries = mergeQueryKeys(ads, jobs);
