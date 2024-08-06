"use client"

import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk"
import { Spinner } from "./Loading"

const KakaoMap = () => {
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
      center={{ lat: 33.5563, lng: 126.79581 }}
      style={{ width: "100%", height: "360px" }}
    >
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{ color: "#000" }}>Hello World!</div>
      </MapMarker>
    </Map>
  )
}

export default KakaoMap
