import React from "react";
import { Skeleton } from "../ui/skeleton";
import { AspectRatio } from "../ui/aspect-ratio";

const BannerSkeleton = () => {
  return (
    <AspectRatio ratio={4 / 1}>
      <Skeleton className="mt-[56px] w-full h-full rounded-xl my-4 bg-gray-200 animate-pulse" />
    </AspectRatio>
  );
};

export default BannerSkeleton;
