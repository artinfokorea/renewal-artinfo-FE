"use client"

import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"
import { Spinner } from "./Loading"

interface Props {
  latitude: number
  longitude: number
  label: string
}

/**
 * 지도 SDK 앱키 — 카카오 로그인(Kakao.init)과 같은 JavaScript 키를 쓴다.
 * 배포 환경에는 NEXT_PUBLIC_KAKAO_API_KEY 만 있어서 전용 변수가 없으면 그걸로 대신한다.
 */
const KAKAO_JAVASCRIPT_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || process.env.NEXT_PUBLIC_KAKAO_API_KEY || ""

const KakaoMap = ({ latitude, longitude, label }: Props) => {
  const [loading, error] = useKakaoLoader({
    appkey: KAKAO_JAVASCRIPT_KEY,
  })

  if (error || !KAKAO_JAVASCRIPT_KEY)
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-1 rounded-lg bg-[#F2F4F6] text-sm text-[#6B7684]">
        <span>지도를 불러오지 못했습니다.</span>
        <a
          href={`https://map.kakao.com/link/map/${encodeURIComponent(label)},${latitude},${longitude}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-main"
        >
          카카오맵에서 보기
        </a>
      </div>
    )

  if (loading)
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )

  return (
    <Map
      center={{ lat: latitude, lng: longitude }}
      style={{ width: "100%", height: "100%" }}
    >
      <MapMarker position={{ lat: latitude, lng: longitude }} />
    </Map>
  )
}

export default KakaoMap
