"use client"

import React, { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import ListPageHeader from "@/components/common/ListPageHeader"
import CreateButton from "@/components/common/CreateButton"
import SearchBar from "@/components/common/SearchBar"
import ArrowUpButton from "@/components/common/ArrowUpButton"
import NewsSkeleton from "@/components/skeleton/NewsSkeleton"
import NewsList from "@/components/news/NewsList"

const page = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { data } = useSession()

  const { data: user } = useQuery({
    ...queries.users.detail(),
    enabled: !!data?.user,
  })
  const { data: newsCount } = useQuery(queries.news.count())

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-12">
      <ListPageHeader
        title="뉴스"
        description={
          <>
            아트인포 예술 뉴스
            {newsCount?.totalCount !== undefined && (
              <>
                {" "}
                <strong className="text-main">{newsCount.totalCount}</strong>개
              </>
            )}
          </>
        }
        action={
          user?.type === UserType.ADMIN ? (
            <CreateButton
              label="뉴스 등록"
              onClick={() => router.push(`${pathname}/create`)}
            />
          ) : undefined
        }
      />

      <div className="mt-5 md:mt-7">
        <SearchBar placeholder="뉴스 제목, 내용으로 검색" />
      </div>

      <Suspense fallback={<NewsSkeleton />}>
        <NewsList />
      </Suspense>

      <ArrowUpButton
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="scroll-to-top-button"
      />
    </div>
  )
}

export default page
