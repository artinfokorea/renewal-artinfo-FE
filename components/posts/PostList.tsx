import React, { useEffect } from "react"

import { useSearchParams } from "next/navigation"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { ScrollApiResponse } from "@/interface"
import { useInView } from "react-intersection-observer"
import { queries } from "@/lib/queries"
import { Post, PostCategory } from "@/types/posts"
import PostCard from "./PostCard"

const PostList = () => {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") as PostCategory
  const keyword = searchParams.get("keyword") as string

  const queryParams = {
    size: 10,
    keyword,
    category: category ? category : undefined,
  }

  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<Post, "posts">>({
    ...queries.posts.infiniteList(queryParams),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
  })

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const totalCount = posts?.pages?.[0]?.totalCount ?? 0
  const isEmpty = !posts?.pages?.[0]?.posts?.length

  return (
    <section aria-label="나눔 글 목록" className="mt-6 md:mt-8">
      <div className="flex items-center justify-between border-b border-[#191F28] pb-3 text-sm text-[#4E5968]">
        <span>
          글 <strong className="text-[#191F28]">{totalCount}</strong>건
        </span>
        <span>최신순</span>
      </div>
      {isEmpty ? (
        <p className="py-16 text-center text-[15px] text-coolgray">
          조건에 맞는 글이 없어요.
        </p>
      ) : (
        <ul>
          {posts?.pages?.map(page =>
            page?.posts?.map((post, index) => (
              <PostCard
                post={post}
                key={post.id}
                ref={ref}
                isLastPage={!(hasNextPage && index === page.posts.length - 5)}
              />
            )),
          )}
        </ul>
      )}
    </section>
  )
}

export default PostList
