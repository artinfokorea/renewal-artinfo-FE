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

  const isEmpty = !posts?.pages?.[0]?.posts?.length

  return (
    <section aria-label="나눔 글 목록" className="mt-4 md:mt-6">
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
