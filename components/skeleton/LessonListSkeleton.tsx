import React from "react"

const LessonListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-10">
      {Array.from({ length: 10 }, (_, index) => index).map(index => (
        <div
          key={index}
          className="h-[240px] w-[170px] animate-pulse rounded rounded-bl-3xl bg-gray-200 md:h-[300px] md:w-[200px]"
        />
      ))}
    </div>
  )
}

export default LessonListSkeleton
