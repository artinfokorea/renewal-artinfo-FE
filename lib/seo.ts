import { convert } from "html-to-text"

/** 정식(canonical) 호스트. apex 도메인은 www로 307 리다이렉트된다. */
export const SITE_URL = "https://www.artinfokorea.com"
export const SITE_NAME = "아트인포"
export const SITE_TITLE = "아트인포-ARTINFO"
export const SITE_DESCRIPTION =
  "예술의 중심 아트인포! 클래식 음악 채용, 단기 연주 구인, 레슨, 공연, 예술 뉴스까지 모든 예술 정보를 아트인포에서 찾아보세요"
export const SITE_LOGO = `${SITE_URL}/img/icons/icon-512x512.png`
export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/metadata_image.png`

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`

/** HTML 본문을 메타 description / JSON-LD용 평문으로 변환 */
export const htmlToPlainText = (html?: string | null, maxLength = 0) => {
  if (!html) return ""
  const text = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
      { selector: "figure", format: "skip" },
    ],
  })
    .replace(/\s+/g, " ")
    .trim()

  if (maxLength > 0 && text.length > maxLength) {
    return `${text.slice(0, maxLength - 1).trimEnd()}…`
  }
  return text
}

/** 첫 번째로 값이 있는 문자열을 description으로 사용 */
export const pickDescription = (
  candidates: Array<string | null | undefined>,
  maxLength = 160,
) => {
  for (const candidate of candidates) {
    const text = candidate?.replace(/\s+/g, " ").trim()
    if (text) {
      return text.length > maxLength
        ? `${text.slice(0, maxLength - 1).trimEnd()}…`
        : text
    }
  }
  return SITE_DESCRIPTION
}

export const toIsoDate = (value?: Date | string | null) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}
