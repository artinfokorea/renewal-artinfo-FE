import React, { useEffect } from "react"

import { useSearchParams } from "next/navigation"
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query"
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
  } = useInfiniteQuery<ScrollApiResponse<Post, "posts">>({
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

  return (
    <div className="mt-4 grid grid-cols-1 px-4 md:grid-cols-2">
      {posts?.pages?.map(page =>
        page?.posts?.map((post, index) => {
          return (
            <PostCard
              post={post}
              key={post.id}
              ref={ref}
              isLeft={index % 2 === 0}
              isLastPage={!(hasNextPage && index === page.posts.length - 5)}
            />
          )
        }),
      )}
    </div>
  )
}

export default PostList
