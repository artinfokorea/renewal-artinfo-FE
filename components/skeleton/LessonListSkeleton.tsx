import React from "react";

const LessonListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
      {Array.from({ length: 10 }, (_, index) => index).map((index) => (
        <div
          key={index}
          className="h-[240px] md:h-[300px] w-[170px] md:w-[200px] rounded rounded-bl-3xl bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
};

export default LessonListSkeleton;
