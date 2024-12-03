import { getAds } from "@/services/ad"
import {
  getInfiniteFullTimeJobs,
  getJob,
  getPullTimeJobs,
  getJobsCount,
  getPartTimeJobs,
  getInfinitePartTimeJobs,
  getMyActivities,
  getJobApplicants,
  getMyApllyList,
} from "@/services/jobs"
import {
  getInfiniteLessons,
  getLesson,
  getLessonFields,
  getLessonsCount,
} from "@/services/lessons"
import {
  getArtCategories,
  getArtFileds,
  getMajors,
  getPartTimeMajorGroups,
} from "@/services/majors"
import { getInfiniteNews, getNewsCount, getNewsDetail } from "@/services/news"
import { getProvinces } from "@/services/system"
import { getMe } from "@/services/users"
import { ListRequest } from "@/interface"
import { JobsRequest, PartTimeJobRequest } from "@/interface/jobs"
import { LessonsRequest } from "@/interface/lessons"
import { ArtFieldRequest } from "@/interface/majors"
import { AdvertisementType } from "@/types/ads"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"
import { getNewsComments } from "@/services/comments"
import { CommentsRequest } from "@/interface/comments"
import {
  getInfinitePerformances,
  getPerformance,
  getPerformanceAreas,
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
  partTimeMajorGroups: () => ({
    queryKey: [""],
    queryFn: getPartTimeMajorGroups,
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
    queryFn: () => getPullTimeJobs(filters),
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
    queryFn: () => getPullTimeJobs(filters),
  }),
  infiniteList: (filters: JobsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteFullTimeJobs({ ...filters, page: pageParam }),
  }),
  count: () => ({
    queryKey: [""],
    queryFn: getJobsCount,
  }),
  partTimeList: (filters: PartTimeJobRequest) => ({
    queryKey: [{ filters }],
    queryFn: () => getPartTimeJobs(filters),
  }),
  infinitePartTimeList: (filters: PartTimeJobRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfinitePartTimeJobs({ ...filters, page: pageParam }),
  }),
  myActivities: (filters: ListRequest) => ({
    queryKey: [filters],
    queryFn: () => getMyActivities(filters),
  }),
  applicantList: (jobId: number) => ({
    queryKey: [jobId],
    queryFn: () => getJobApplicants(jobId),
  }),
  myApplyList: (userId: number, filters: ListRequest) => ({
    queryKey: [userId, filters],
    queryFn: () => getMyApllyList(filters),
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
  areas: (request: ListRequest) => ({
    queryKey: [request],
    queryFn: () => getPerformanceAreas(request),
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
