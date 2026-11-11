import { MetadataRoute } from "next"
import { publicApiRequest } from "@/services"
import { ListApiResponse } from "@/interface"
import { SITE_URL, toIsoDate } from "@/lib/seo"

/** 1시간마다 재생성 */
export const revalidate = 3600

const PAGE_SIZE = 500
const MAX_PAGES = 40 // 섹션당 최대 20,000개

type ListItem = {
  id: number
  createdAt?: Date | string
}

/** 페이지네이션 API를 끝까지 읽어 전체 목록을 모은다. */
const fetchAll = async <K extends string>(
  path: string,
  key: K,
): Promise<ListItem[]> => {
  const items: ListItem[] = []
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await publicApiRequest.get<
        ListApiResponse<ListItem, K>
      >(path, { params: { page, size: PAGE_SIZE } })
      const chunk = response?.item?.[key] ?? []
      items.push(...chunk)
      if (chunk.length < PAGE_SIZE) break
    }
  } catch (error) {
    console.error(`sitemap: failed to fetch ${path}`, error)
  }
  return items
}

const toEntries = (
  items: ListItem[],
  pathOf: (id: number) => string,
  options: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
  },
): MetadataRoute.Sitemap =>
  items.map(item => ({
    url: `${SITE_URL}${pathOf(item.id)}`,
    lastModified: toIsoDate(item.createdAt),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  }))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/jobs?jobTimeType=PART_TIME`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/lessons`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/performances`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/competitions`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/posts`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/inquiry`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const [jobs, partTimeJobs, lessons, performances, competitions, news, posts] =
    await Promise.all([
      fetchAll("/jobs", "jobs"),
      fetchAll("/jobs/part-time", "jobs"),
      fetchAll("/lessons", "lessons"),
      fetchAll("/performances", "performances"),
      fetchAll("/competitions", "competitions"),
      fetchAll("/news", "news"),
      fetchAll("/posts", "posts"),
    ])

  return [
    ...staticEntries,
    ...toEntries(jobs, id => `/jobs/${id}`, { changeFrequency: "weekly", priority: 0.8 }),
    ...toEntries(partTimeJobs, id => `/jobs/part-time/${id}`, { changeFrequency: "weekly", priority: 0.7 }),
    ...toEntries(lessons, id => `/lessons/${id}`, { changeFrequency: "monthly", priority: 0.6 }),
    ...toEntries(performances, id => `/performances/${id}`, { changeFrequency: "weekly", priority: 0.7 }),
    ...toEntries(competitions, id => `/competitions/${id}`, { changeFrequency: "weekly", priority: 0.7 }),
    ...toEntries(news, id => `/news/${id}`, { changeFrequency: "monthly", priority: 0.7 }),
    ...toEntries(posts, id => `/posts/${id}`, { changeFrequency: "weekly", priority: 0.5 }),
  ]
}
