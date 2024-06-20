import { getAds } from "@/apis/ad";
import { getInfiniteJobs, getJob, getJobs, getJobsCount } from "@/apis/jobs";
import { getInfiniteLessons, getLesson, getLessonsCount } from "@/apis/lessons";
import { getMajors, getProvinces } from "@/apis/system";
import { getMe } from "@/apis/users";
import { JobsRequest } from "@/interface/jobs";
import { LessonsRequest } from "@/interface/lessons";
import { AdvertisementType } from "@/types/ads";
import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";

const ads = createQueryKeys("ads", {
  list: (type: AdvertisementType) => ({
    queryKey: [type],
    queryFn: () => getAds(type),
  }),
});

const majors = createQueryKeys("majors", {
  list: () => ({
    queryKey: [""],
    queryFn: () => getMajors(),
  }),
});

const provinces = createQueryKeys("provinces", {
  list: (parentId?: number) => ({
    queryKey: [parentId],
    queryFn: () => getProvinces(parentId),
  }),
});

const lessons = createQueryKeys("lessons", {
  detail: (LessonId: number) => ({
    queryKey: [LessonId],
    queryFn: () => getLesson(LessonId),
  }),
  list: (filters: LessonsRequest) => ({
    queryKey: ["list", { filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: LessonsRequest) => ({
    queryKey: ["infiniteList", { filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteLessons({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: ["count"],
    queryFn: () => getLessonsCount(),
  }),
});

const users = createQueryKeys("users", {
  detail: () => ({
    queryKey: [""],
    queryFn: () => getMe(),
  }),
});

const jobs = createQueryKeys("jobs", {
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
  count: () => ({
    queryKey: ["count"],
    queryFn: () => getJobsCount(),
  }),
});

export const queries = mergeQueryKeys(
  ads,
  jobs,
  majors,
  provinces,
  lessons,
  users
);
