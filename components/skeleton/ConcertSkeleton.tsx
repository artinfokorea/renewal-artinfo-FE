import React from "react";
import { Skeleton } from "../ui/skeleton";

const ConcertSkeleton = () => {
  return (
    <section className="py-6 gap-8 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => index).map((index) => (
        <Skeleton
          key={index}
          className={`h-[240px] md:h-[280px] bg-gray-200 animate-pulse rounded-md ${
            index < 2 ? "block" : "hidden md:block"
          }`}
        />
      ))}
    </section>
  );
};

export default ConcertSkeleton;
