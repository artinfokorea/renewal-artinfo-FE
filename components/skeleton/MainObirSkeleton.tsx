import React from "react";
import { Skeleton } from "../ui/skeleton";

const MainObirSkeleton = () => {
  return (
    <section className="my-8 md:my-12">
      <Skeleton className="h-6 w-20 bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4 mb-12">
        {Array.from({ length: 3 }, (_, index) => index).map((index) => (
          <Skeleton
            key={index}
            className={`h-[66px] w-full bg-gray-200 animate-pulse`}
          />
        ))}
      </div>
    </section>
  );
};

export default MainObirSkeleton;
