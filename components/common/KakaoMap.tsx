"use client"

import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"
import { Spinner } from "./Loading"

interface Props {
  latitude: number
  longitude: number
  label: string
}

const KakaoMap = ({ latitude, longitude, label }: Props) => {
  const [loading] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!,
  })

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
