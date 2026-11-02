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
