"use client"

import AddButton from "@/components/common/AddButton"
import CreateLinkButton from "@/components/common/CreateLinkButton"
import ListSearchForm from "@/components/common/ListSearchForm"
import ProvinceDialog from "@/components/dialog/ProvinceDialog"
import LessonList from "@/components/lessons/LessonList"
import LessonListSkeleton from "@/components/skeleton/LessonListSkeleton"
import { queries } from "@/lib/queries"
import { useQueries, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import ArrowUpButton from "@/components/common/ArrowUpButton"
import useBreakPoint from "@/hooks/useBreakPoint"
import { PostSearchTabs } from "@/components/posts/PostSearchTabs"
import PostList from "@/components/posts/PostList"

import { PostMobileFilterTabs } from "@/components/posts/PostMobileFilterTabs"
import { Suspense, useState } from "react"
import { MobileTopPosts } from "@/components/posts/MobileTopPosts"
import { AnimatePresence } from "framer-motion"

const page = () => {
  const router = useRouter()
  const [isMobileTopPosts, setIsMobileTopPosts] = useState(false)

  const handleToggleMobileTopPosts = () => setIsMobileTopPosts(prev => !prev)

  const pathname = usePathname()
  const isDesktop = useBreakPoint("lg")

  const { data: popularPosts } = useQuery({
    ...queries.posts.popular(),
  })

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <ListSearchForm placeholder="제목, 내용, 글쓴이 등을 검색해보세요.">
        <h4 className="text-[17px] font-bold md:text-[17px]">
          여러분의 이야기를 나누어주세요.
        </h4>
      </ListSearchForm>

      <section className="flex">
        <article className="ml-4 hidden h-fit min-h-[150px] min-w-[130px] space-y-4 rounded-md border border-[#d9d9d9] px-3 py-4 lg:block">
          <h5 className="text-sm font-semibold">Top Author</h5>
          <ol className="list-inside list-decimal space-y-3 text-xs font-light">
            {popularPosts?.posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ol>
        </article>

        <div className="flex w-full flex-col lg:ml-12 lg:mt-4 lg:flex-1">
          <div className="hidden items-center justify-between lg:flex">
            <PostSearchTabs />
            <CreateLinkButton
              onClick={() => router.push(`${pathname}/create`)}
              text="글쓰기"
            />
          </div>
          {/* Mobile Filter */}
          {!isDesktop && (
            <PostMobileFilterTabs
              handleToggleMobileTopPosts={handleToggleMobileTopPosts}
            />
          )}

          <Suspense fallback={<LessonListSkeleton />}>
            <PostList />
          </Suspense>
        </div>
        <ArrowUpButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-to-top-button"
        />
        <AddButton
          onClick={() => router.push(`${pathname}/create`)}
          className="fixed bottom-32 right-4 z-50 h-12 w-12 rounded-full bg-white shadow-md lg:hidden"
        />
      </section>
      <AnimatePresence>
        {isMobileTopPosts && (
          <MobileTopPosts
            posts={popularPosts?.posts}
            handleToggleMobileTopPosts={handleToggleMobileTopPosts}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default page
