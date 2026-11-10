import { getAds } from "@/services/ad"
import {
  getAdminBreakdown,
  getAdminDaily,
  getAdminEngagement,
  getAdminOverview,
} from "@/services/admin"
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
import {
  getInfiniteNews,
  getNews,
  getNewsCount,
  getNewsDetail,
} from "@/services/news"
import { getProvinces } from "@/services/system"
import { getMe } from "@/services/users"
import { ListRequest } from "@/interface"
import { JobsRequest, PartTimeJobRequest } from "@/interface/jobs"
import { LessonsRequest } from "@/interface/lessons"
import { ArtFieldRequest } from "@/interface/majors"
import { AdvertisementType } from "@/types/ads"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"
import {
  getCompetition,
  getCompetitions,
  getInfiniteCompetitions,
} from "@/services/competitions"
import { CompetitionsRequest } from "@/interface/competitions"
import { getNewsComments, getPostsComments } from "@/services/comments"
import { CommentsRequest, PostCommentsRequest } from "@/interface/comments"
import {
  getInfinitePerformances,
  getPerformance,
  getPerformanceAreas,
  getPerformances,
  getPerformancesCount,
} from "@/services/performances"
import { PerformancesRequest } from "@/interface/performances"
import {
  getInfinitePosts,
  getPopularPosts,
  getPostDetail,
  getPosts,
} from "@/services/posts"
import { PostsRequest } from "@/interface/posts"

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
  list: (filters: ListRequest) => ({
    queryKey: [filters],
    queryFn: () => getNews(filters),
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
  post: (filters: PostCommentsRequest) => ({
    queryKey: [filters.postId, { filters }],
    queryFn: () => getPostsComments(filters),
  }),
})

const competitions = createQueryKeys("competitions", {
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => getCompetition(id),
  }),
  list: (filters: CompetitionsRequest) => ({
    queryKey: [{ filters }],
    queryFn: () => getCompetitions(filters),
  }),
  infiniteList: (filters: CompetitionsRequest) => ({
    queryKey: [{ filters }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfiniteCompetitions({ ...filters, page: pageParam }),
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

const posts = createQueryKeys("posts", {
  list: (filters: PostsRequest) => ({
    queryKey: [filters],
    queryFn: () => getPosts(filters),
  }),
  infiniteList: (filters: PostsRequest) => ({
    queryKey: [filters],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfinitePosts({ ...filters, page: pageParam }),
  }),
  detail: (postId: number) => ({
    queryKey: [postId],
    queryFn: () => getPostDetail(postId),
  }),
  popular: () => ({
    queryKey: [""],
    queryFn: () => getPopularPosts(),
  }),
})

const admin = createQueryKeys("admin", {
  overview: () => ({
    queryKey: [""],
    queryFn: getAdminOverview,
  }),
  daily: (days: number) => ({
    queryKey: [days],
    queryFn: () => getAdminDaily(days),
  }),
  breakdown: () => ({
    queryKey: [""],
    queryFn: getAdminBreakdown,
  }),
  engagement: (days: number) => ({
    queryKey: [days],
    queryFn: () => getAdminEngagement(days),
  }),
})

export const queries = mergeQueryKeys(
  admin,
  ads,
  competitions,
  jobs,
  majors,
  provinces,
  lessons,
  users,
  news,
  comments,
  performances,
  posts,
)
