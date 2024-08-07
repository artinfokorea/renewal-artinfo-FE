import { getAds } from "@/services/ad"
import { getInfiniteJobs, getJob, getJobs, getJobsCount } from "@/services/jobs"
import {
  getInfiniteLessons,
  getLesson,
  getLessonFields,
  getLessonsCount,
} from "@/services/lessons"
import { getArtCategories, getArtFileds, getMajors } from "@/services/majors"
import { getInfiniteNews, getNewsCount, getNewsDetail } from "@/services/news"
import { getProvinces } from "@/services/system"
import { getMe } from "@/services/users"
import { ListRequest } from "@/interface"
import { JobsRequest } from "@/interface/jobs"
import { LessonsRequest } from "@/interface/lessons"
import { ArtFieldRequest } from "@/interface/majors"
import { AdvertisementType } from "@/types/ads"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"

const ads = createQueryKeys("ads", {
  list: (type: AdvertisementType) => ({
    queryKey: [type],
    queryFn: () => getAds(type),
  }),
})

const majors = createQueryKeys("majors", {
  list: () => ({
    queryKey: [""],
    queryFn: getMajors,
  }),
  artCategories: () => ({
    queryKey: ["artCategories"],
    queryFn: getArtCategories,
  }),
  artFields: (request: ArtFieldRequest) => ({
    queryKey: ["artFields", request],
    queryFn: () => getArtFileds(request),
  }),
})

const provinces = createQueryKeys("provinces", {
  list: (parentId?: number) => ({
    queryKey: [parentId],
    queryFn: () => getProvinces(parentId),
  }),
})

const lessons = createQueryKeys("lessons", {
  fields: () => ({
    queryKey: ["fields"],
    queryFn: getLessonFields,
  }),
  detail: (lessonId: number) => ({
    queryKey: [lessonId],
    queryFn: () => getLesson(lessonId),
  }),
  list: (filters: LessonsRequest) => ({
    queryKey: ["list", { filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: LessonsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteLessons({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: ["count"],
    queryFn: getLessonsCount,
  }),
})

const users = createQueryKeys("users", {
  detail: () => ({
    queryKey: ["me"],
    queryFn: () => getMe(),
  }),
})

const news = createQueryKeys("news", {
  detail: (newsId: number) => ({
    queryKey: [newsId],
    queryFn: () => getNewsDetail(newsId),
  }),
  infiniteList: (filters: ListRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteNews({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: ["count"],
    queryFn: getNewsCount,
  }),
})

const jobs = createQueryKeys("jobs", {
  detail: (jobId: number) => ({
    queryKey: [jobId],
    queryFn: () => getJob(jobId),
  }),
  list: (filters: JobsRequest) => ({
    queryKey: ["list", { filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: JobsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteJobs({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: ["count"],
    queryFn: getJobsCount,
  }),
})

export const queries = mergeQueryKeys(
  ads,
  jobs,
  majors,
  provinces,
  lessons,
  users,
  news,
)
