const PostListSkeleton = () => {
  return (
    <ul className="mt-6 border-t border-[#191F28] md:mt-8">
      {Array.from({ length: 6 }, (_, index) => index).map(index => (
        <li
          key={index}
          className="flex gap-4 border-b border-[#EEF0F3] py-4 md:gap-6 md:px-2 md:py-5"
        >
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3.5 w-10 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-4 w-3/5 animate-pulse rounded bg-[#F2F4F6]" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-[#F2F4F6]" />
          </div>
          <div className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-[10px] bg-[#F2F4F6] md:h-[96px] md:w-[96px] md:rounded-xl" />
        </li>
      ))}
    </ul>
  )
}

export default PostListSkeleton
