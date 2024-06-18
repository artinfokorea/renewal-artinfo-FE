import React from "react";

const JobListSkeleton = () => {
  return (
    <div className="mt-4">
      {Array.from({ length: 10 }, (_, index) => index).map((index) => (
        <div
          key={index}
          className="rounded-xl h-[114px] md:h-[174px] flex py-4 my-4"
        >
          <div className="w-[120px] md:w-[230px] bg-gray-200 animate-pulse rounded-lg" />
          <div className="ml-4 md:ml-12 py-2 flex-1 flex flex-col justify-center">
            <div className="h-5 w-40 bg-gray-200 animate-pulse mb-2" />
            <div className="h-5 w-24 bg-gray-200 animate-pulse mb-2" />
            <div className="h-5 w-28 bg-gray-200 animate-pulse mb-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListSkeleton;
