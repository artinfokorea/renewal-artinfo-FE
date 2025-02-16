"use client"

import AddButton from "@/components/common/AddButton"
import CreateLinkButton from "@/components/common/CreateLinkButton"
import ListSearchForm from "@/components/common/ListSearchForm"
import ProvinceDialog from "@/components/dialog/ProvinceDialog"
import LessonList from "@/components/lessons/LessonList"
import LessonListSkeleton from "@/components/skeleton/LessonListSkeleton"
import { queries } from "@/lib/queries"
import { useQueries } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import useBreakPoint from "@/hooks/useBreakPoint"
import { PostSearchTabs } from "@/components/posts/PostSearchTabs"
import PostList from "@/components/posts/PostList"
import MobileFilterTab from "@/components/common/MobileFilterTab"
import { PostMobileFilterTabs } from "@/components/posts/PostMobileFilterTabs"

const page = () => {
  const searchParams = useSearchParams()

  const router = useRouter()
  const [isProvinceDialog, setIsProvinceDialog] = useState(false)
  const pathname = usePathname()
  const isDesktop = useBreakPoint("lg")

  return (
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm placeholder="제목, 내용, 글쓴이 등을 검색해보세요.">
        <h4 className="text-[17px] font-bold md:text-[17px]">
          여러분의 이야기를 나누어주세요.
        </h4>
      </ListSearchForm>

      <section className="flex">
        <article className="hidden h-fit min-h-[150px] w-[120px] space-y-4 rounded-md border border-[#d9d9d9] px-3 py-4 md:block">
          <h5 className="text-sm font-semibold">Top Author</h5>
          <ol className="list-inside list-decimal space-y-2 text-xs font-light">
            <li>hihi</li>
            <li>hihi</li>
            <li>hihi</li>
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
          {!isDesktop && <PostMobileFilterTabs />}

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
    </div>
  )
}

export default page
