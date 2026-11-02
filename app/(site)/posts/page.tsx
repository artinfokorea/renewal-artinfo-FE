"use client"

import { Suspense } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { PostCategoryLabel } from "@/types/posts"
import { useSearchParamList } from "@/hooks/useSearchParamList"
import ListPageHeader from "@/components/common/ListPageHeader"
import CreateButton from "@/components/common/CreateButton"
import SearchBar from "@/components/common/SearchBar"
import FilterChips from "@/components/common/FilterChips"
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
  // API 가 카테고리를 하나만 받으므로 단일 선택: 같은 칩을 다시 누르면 해제
  const categoryFilter = useSearchParamList("category")

  const { data: popularPosts } = useQuery({
    ...queries.posts.popular(),
  })

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-12">
      <ListPageHeader
        title="나눔"
        description="후기·질문·홍보까지, 음악인들의 이야기를 나눠요"
        action={
          <CreateButton
            label="글쓰기"
            onClick={() => router.push(`${pathname}/create`)}
          />
        }
      />

      <div className="mt-5 md:mt-7">
        <SearchBar placeholder="제목, 내용, 글쓴이로 검색" />
      </div>

      <div className="mt-4 md:mt-5">
        <FilterChips
          label="카테고리 필터"
          options={CATEGORY_OPTIONS}
          selected={categoryFilter.values.slice(0, 1)}
          onToggle={value =>
            categoryFilter.set(
              categoryFilter.values.includes(value) ? [] : [value],
            )
          }
          onClear={categoryFilter.clear}
        />
      </div>

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
