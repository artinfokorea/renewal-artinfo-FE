/** 초를 "1분 33초", "45초", "1시간 2분" 처럼 */
export const formatDuration = (seconds: number) => {
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) return `${s}초`
  if (s < 3600) {
    const rest = s % 60
    return rest ? `${Math.floor(s / 60)}분 ${rest}초` : `${Math.floor(s / 60)}분`
  }
  const minutes = Math.floor((s % 3600) / 60)
  return minutes ? `${Math.floor(s / 3600)}시간 ${minutes}분` : `${Math.floor(s / 3600)}시간`
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000

/** DB 의 timestamp(UTC, Z 없이 올 수 있음) → 한국 날짜 "YYYY.MM.DD" */
export const kstDate = (iso?: string | null) => {
  if (!iso) return null
  const d = new Date(new Date(iso.endsWith("Z") ? iso : `${iso}Z`).getTime() + KST_OFFSET_MS)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10).replace(/-/g, ".")
}

/** DB 의 timestamp → "YYYY.MM.DD HH:mm" (한국) */
export const kstDateTime = (iso?: string | null) => {
  if (!iso) return null
  const d = new Date(new Date(iso.endsWith("Z") ? iso : `${iso}Z`).getTime() + KST_OFFSET_MS)
  if (Number.isNaN(d.getTime())) return null
  const s = d.toISOString()
  return `${s.slice(0, 10).replace(/-/g, ".")} ${s.slice(11, 16)}`
}
