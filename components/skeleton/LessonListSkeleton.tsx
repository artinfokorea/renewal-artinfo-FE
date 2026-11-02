const LessonListSkeleton = () => {
  return (
    <div className="mt-6 border-t border-[#191F28] md:mt-8">
      <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-6 md:grid-cols-4 md:gap-x-5 md:gap-y-8">
        {Array.from({ length: 8 }, (_, index) => index).map(index => (
          <li key={index} className="flex flex-col gap-2.5">
            <div className="aspect-[20/27] animate-pulse rounded-xl bg-[#F2F4F6]" />
            <div className="h-5 w-20 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-4 w-28 animate-pulse rounded bg-[#F2F4F6]" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LessonListSkeleton
