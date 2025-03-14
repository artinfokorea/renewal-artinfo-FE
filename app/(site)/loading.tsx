import ArtSkeleton from "@/components/skeleton/ArtSkeleton"
import BannerSkeleton from "@/components/skeleton/BannerSkeleton"
import MainCommunitySkeleton from "@/components/skeleton/MainCommunitySkeleton"
import MainJobSkeleton from "@/components/skeleton/MainJobSkeleton"
import React from "react"

const loading = () => {
  return (
    <div className="mx-auto h-full max-w-screen-lg px-4">
      <BannerSkeleton />
      <ArtSkeleton />
      <MainCommunitySkeleton />
      <MainJobSkeleton />
      <ArtSkeleton />
    </div>
  )
}

export default loading
