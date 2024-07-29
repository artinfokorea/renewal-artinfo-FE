import React from "react"

const LessonListSkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 md:gap-8">
      {Array.from({ length: 10 }, (_, index) => index).map(index => (
        <div
          key={index}
          className="aspect-[20/27] animate-pulse rounded rounded-bl-3xl bg-gray-200"
        />
      ))}
    </div>
  )
}

export default LessonListSkeleton
