"use client"

import React, { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import ListPageHeader from "@/components/common/ListPageHeader"
import ListToolbar from "@/components/common/ListToolbar"
import CreateButton from "@/components/common/CreateButton"
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

  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-6 md:px-6 md:pt-14">
      <ListPageHeader
        title="뉴스"
        action={
          user?.type === UserType.ADMIN ? (
            <CreateButton
              label="뉴스 등록"
              onClick={() => router.push(`${pathname}/create`)}
            />
          ) : undefined
        }
      />

      <ListToolbar searchPlaceholder="뉴스 제목, 내용 검색" />

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
