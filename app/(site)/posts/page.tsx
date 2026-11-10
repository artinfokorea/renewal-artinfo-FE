"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { PostCategoryLabel } from "@/types/posts"
import ListPageHeader from "@/components/common/ListPageHeader"
import NewsTabs from "@/components/common/NewsTabs"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import PostList from "@/components/posts/PostList"
import TopPosts from "@/components/posts/TopPosts"
import PostListSkeleton from "@/components/skeleton/PostListSkeleton"

const CATEGORY_OPTIONS = Object.entries(PostCategoryLabel).map(
  ([value, label]) => ({ label, value }),
)

const page = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { data: popularPosts } = useQuery({
    ...queries.posts.popular(),
  })

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-4 md:px-6 md:pt-14">
      <NewsTabs />
      <ListPageHeader
        title="나눔"
        action={
          <CreateButton
            label="글쓰기"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <ListToolbar
        searchPlaceholder="제목, 내용, 글쓴이 검색"
        groups={[
          // API 가 카테고리를 하나만 받는다
          { param: "category", name: "카테고리", options: CATEGORY_OPTIONS, single: true },
        ]}
      />

      <TopPosts posts={popularPosts?.posts} />

      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>

      <ArrowUpButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scroll-to-top-button"
      />
    </div>
  )
}

export default page
