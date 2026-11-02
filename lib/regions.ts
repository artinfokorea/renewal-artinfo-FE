import { PROVINCE } from "@/types"
import { FilterOption } from "@/components/common/ListToolbar"

/** 칩에 보여줄 시·도 순서 (수도권 → 광역시 → 도) */
const REGION_ORDER = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
]

/** /provinces 응답을 짧은 이름(서울, 강원…)의 필터 옵션으로 바꾼다 */
export const toRegionOptions = (provinces?: PROVINCE[]): FilterOption[] => {
  if (!provinces) return []
  return provinces
    .map(province => ({
      label: province.name.slice(0, 2),
      value: province.id.toString(),
    }))
    .sort((a, b) => {
      const ai = REGION_ORDER.indexOf(a.label)
      const bi = REGION_ORDER.indexOf(b.label)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
}

/** "서울 송파구 …" 주소에서 시·도 두 글자만 */
export const shortRegion = (address?: string) =>
  address ? address.split(" ")[0].substring(0, 2) : ""
