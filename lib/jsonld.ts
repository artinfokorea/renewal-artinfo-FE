import { JOB, JobType } from "@/types/jobs"
import { NEWS } from "@/types/news"
import { PERFORMANCE_DETAIL } from "@/types/performances"
import { COMPETITION } from "@/types/competitions"
import { LESSON } from "@/types/lessons"
import { Post } from "@/types/posts"
import {
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  htmlToPlainText,
  toIsoDate,
} from "./seo"

export type JsonLdObject = Record<string, unknown>

const organizationRef = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: SITE_LOGO,
  },
}

/** 루트 레이아웃: Organization + WebSite */
export const siteJsonLd = (): JsonLdObject[] => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ["ARTINFO", "아트인포코리아"],
    url: SITE_URL,
    logo: SITE_LOGO,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ko-KR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
]

export const breadcrumbJsonLd = (
  items: Array<{ name: string; path: string }>,
): JsonLdObject => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

const employmentTypeOf = (job: JOB, isPartTime: boolean) => {
  if (isPartTime) return "PART_TIME"
  if (job.type === JobType.AMATEUR || job.type === JobType.YOUTH) {
    return "VOLUNTEER"
  }
  return "FULL_TIME"
}

export const jobPostingJsonLd = (
  job: JOB,
  options: { isPartTime?: boolean } = {},
): JsonLdObject => {
  const isPartTime = options.isPartTime ?? false
  const path = isPartTime ? `/jobs/part-time/${job.id}` : `/jobs/${job.id}`
  const address = [job.address, job.addressDetail].filter(Boolean).join(" ")
  const description = htmlToPlainText(job.contents) || job.title
  // 백엔드가 마감일을 게시일과 같은 값으로 채우는 경우가 있어,
  // 게시일보다 하루 이상 뒤일 때만 validThrough로 사용한다.
  const postedAt = job.createdAt ? new Date(job.createdAt).getTime() : NaN
  const endsAt = job.endAt ? new Date(job.endAt).getTime() : NaN
  const validThrough =
    !Number.isNaN(endsAt) && endsAt - postedAt > 24 * 60 * 60 * 1000
      ? toIsoDate(job.endAt)
      : undefined

  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: toIsoDate(job.createdAt),
    validThrough,
    employmentType: employmentTypeOf(job, isPartTime),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName || SITE_NAME,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: address || undefined,
        addressRegion: job.province || undefined,
        addressCountry: "KR",
      },
    },
    url: absoluteUrl(path),
    directApply: isPartTime,
  }

  if (job.imageUrl) data.image = job.imageUrl
  if (job.recruitSiteUrl) data.applicationContact = { url: job.recruitSiteUrl }
  if (isPartTime && job.fee) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "KRW",
      value: { "@type": "QuantitativeValue", value: job.fee, unitText: "DAY" },
    }
  }
  const majors = job.majors?.majors?.map(major => major.koName).filter(Boolean)
  if (majors?.length) data.occupationalCategory = majors.join(", ")

  return data
}

export const newsArticleJsonLd = (news: NEWS): JsonLdObject => {
  const path = `/news/${news.id}`
  const description =
    news.summary?.trim() || htmlToPlainText(news.contents, 200)
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description,
    articleBody: htmlToPlainText(news.contents),
    image: news.thumbnailImageUrl ? [news.thumbnailImageUrl] : undefined,
    datePublished: toIsoDate(news.createdAt),
    dateModified: toIsoDate(news.createdAt),
    inLanguage: "ko-KR",
    author: organizationRef,
    publisher: organizationRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    url: absoluteUrl(path),
  }
}

export const performanceEventJsonLd = (
  performance: PERFORMANCE_DETAIL,
): JsonLdObject => {
  const path = `/performances/${performance.id}`
  const placeName = performance.customAreaName || performance.area?.name
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: performance.title,
    description:
      htmlToPlainText(performance.introduction, 500) || performance.title,
    startDate: toIsoDate(performance.startAt),
    endDate: toIsoDate(performance.endAt),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: performance.posterImageUrl ? [performance.posterImageUrl] : undefined,
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
  }

  if (placeName) {
    data.location = {
      "@type": "Place",
      name: placeName,
      address: performance.area?.address
        ? {
            "@type": "PostalAddress",
            streetAddress: performance.area.address,
            addressCountry: "KR",
          }
        : { "@type": "PostalAddress", addressCountry: "KR" },
    }
  }
  if (performance.cast) {
    data.performer = { "@type": "PerformingGroup", name: performance.cast }
  }
  if (performance.host) {
    data.organizer = { "@type": "Organization", name: performance.host }
  }
  if (performance.reservationUrl) {
    data.offers = {
      "@type": "Offer",
      url: performance.reservationUrl,
      availability: "https://schema.org/InStock",
      ...(performance.ticketPrice
        ? { description: performance.ticketPrice }
        : {}),
    }
  }
  if (performance.age) data.typicalAgeRange = performance.age

  return data
}

export const lessonServiceJsonLd = (lesson: LESSON): JsonLdObject => {
  const path = `/lessons/${lesson.id}`
  const majorList: Array<string | undefined> = lesson.majors?.length
    ? lesson.majors
    : [lesson.major]
  const areaList: Array<string | undefined> = lesson.areas?.length
    ? lesson.areas
    : [lesson.area]
  const majors = majorList.filter(Boolean).join(", ")
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${majors} 레슨`,
    name: `${lesson.name} ${majors} 레슨`,
    description: htmlToPlainText(lesson.introduction, 500) || undefined,
    provider: {
      "@type": "Person",
      name: lesson.name,
      image: lesson.imageUrl || undefined,
    },
    areaServed: areaList.filter(Boolean).map(name => ({
      "@type": "Place",
      name,
    })),
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
  }
  if (lesson.imageUrl) data.image = lesson.imageUrl
  if (lesson.pay) {
    data.offers = {
      "@type": "Offer",
      price: lesson.pay,
      priceCurrency: "KRW",
    }
  }
  return data
}

export const postJsonLd = (post: Post): JsonLdObject => {
  const path = `/posts/${post.id}`
  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: post.title,
    text: htmlToPlainText(post.contents),
    image: post.thumbnailImageUrl ? [post.thumbnailImageUrl] : undefined,
    datePublished: toIsoDate(post.createdAt),
    author: { "@type": "Person", name: post.authorName },
    publisher: organizationRef,
    url: absoluteUrl(path),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    inLanguage: "ko-KR",
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likeCount ?? 0,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.commentCount ?? 0,
      },
    ],
  }
}

/**
 * 콩쿠르 상세 — schema.org Event. 대회일(heldAt)이 있으면 그날, 없으면 접수 마감일을 startDate 로 둔다.
 * 접수 링크가 있으면 offers(접수)로, 참가비는 그 설명으로 넣는다.
 */
export const competitionEventJsonLd = (competition: COMPETITION): JsonLdObject => {
  const path = `/competitions/${competition.id}`
  const summary = [competition.host, competition.divisions.join("·"), competition.ages.join("·"), competition.area]
    .filter(Boolean)
    .join(" | ")
  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: competition.title,
    description: htmlToPlainText(competition.description, 500) || summary || competition.title,
    startDate: toIsoDate(competition.heldAt || competition.closeAt),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: competition.posterUrl ? [competition.posterUrl] : undefined,
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
    location: {
      "@type": "Place",
      name: competition.venue || competition.area,
      address: { "@type": "PostalAddress", addressRegion: competition.area, addressCountry: "KR" },
    },
    organizer: { "@type": "Organization", name: competition.organizer || competition.host },
  }
  if (competition.applyLink) {
    data.offers = {
      "@type": "Offer",
      url: competition.applyLink,
      availability: competition.phase === "CLOSED" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      validFrom: toIsoDate(competition.openAt),
      validThrough: toIsoDate(competition.closeAt),
      ...(competition.fee ? { description: competition.fee } : {}),
    }
  }
  return data
}
