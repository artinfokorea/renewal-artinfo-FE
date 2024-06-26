import React from "react"
import { AspectRatio } from "../ui/aspect-ratio"

const BannerSkeleton = () => {
  return (
    <AspectRatio ratio={4 / 1}>
      <div className="w-full h-full rounded-xl my-4 skeleton-list-item mb-4" />
    </AspectRatio>
  )
}

export default BannerSkeleton
