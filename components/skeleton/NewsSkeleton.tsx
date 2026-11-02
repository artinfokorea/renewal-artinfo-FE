const NewsSkeleton = () => {
  return (
    <ul className="mt-6 border-t border-[#191F28] md:mt-8">
      {Array.from({ length: 6 }, (_, index) => index).map(index => (
        <li
          key={index}
          className="flex gap-3.5 border-b border-[#EEF0F3] py-4 md:items-center md:gap-6 md:px-2 md:py-5"
        >
          <div className="aspect-[27/17] w-[120px] shrink-0 animate-pulse rounded-[10px] bg-[#F2F4F6] md:w-[200px] md:rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="hidden h-4 w-3/5 animate-pulse rounded bg-[#F2F4F6] md:block" />
            <div className="h-4 w-20 animate-pulse rounded bg-[#F2F4F6]" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default NewsSkeleton
