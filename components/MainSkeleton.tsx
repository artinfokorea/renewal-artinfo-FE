import React from "react"
import BannerSkeleton from "./skeleton/BannerSkeleton"
import ArtSkeleton from "./skeleton/ArtSkeleton"
import MainJobSkeleton from "./skeleton/MainJobSkeleton"

const MainSkeleton = () => {
  return (
    <>
      <BannerSkeleton />
      <ArtSkeleton />
      <MainJobSkeleton />
      <ArtSkeleton />
    </>
  )
}

export default MainSkeleton
