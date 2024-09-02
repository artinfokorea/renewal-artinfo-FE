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
import { getNewsComments } from "@/services/comments"
import { CommentsRequest } from "@/interface/comments"
import {
  getInfinitePerformances,
  getPerformance,
  getPerformances,
  getPerformancesCount,
} from "@/services/performances"
import { PerformancesRequest } from "@/interface/performances"

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
    queryKey: [""],
    queryFn: getArtCategories,
  }),
  artFields: (request: ArtFieldRequest) => ({
    queryKey: ["", request],
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
    queryKey: [""],
    queryFn: getLessonFields,
  }),
  detail: (lessonId: number) => ({
    queryKey: [lessonId],
    queryFn: () => getLesson(lessonId),
  }),
  list: (filters: LessonsRequest) => ({
    queryKey: ["", { filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: LessonsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteLessons({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: [""],
    queryFn: getLessonsCount,
  }),
})

const users = createQueryKeys("users", {
  detail: () => ({
    queryKey: [""],
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
    queryKey: [""],
    queryFn: getNewsCount,
  }),
})

const comments = createQueryKeys("comments", {
  news: (filters: CommentsRequest) => ({
    queryKey: [filters.newsId, { filters }],
    queryFn: () => getNewsComments(filters),
  }),
})

const jobs = createQueryKeys("jobs", {
  detail: (jobId: number) => ({
    queryKey: [jobId],
    queryFn: () => getJob(jobId),
  }),
  list: (filters: JobsRequest) => ({
    queryKey: [{ filters }],
    queryFn: () => getJobs(filters),
  }),
  infiniteList: (filters: JobsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteJobs({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: [""],
    queryFn: getJobsCount,
  }),
})

const performances = createQueryKeys("performances", {
  detail: (performanceId: number) => ({
    queryKey: [performanceId],
    queryFn: () => getPerformance(performanceId),
  }),
  list: (filters: PerformancesRequest) => ({
    queryKey: [{ filters }],
    queryFn: () => getPerformances(filters),
  }),
  infiniteList: (filters: PerformancesRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfinitePerformances({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: [""],
    queryFn: getPerformancesCount,
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
  comments,
  performances,
)
