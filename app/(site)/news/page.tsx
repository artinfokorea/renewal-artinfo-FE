"use client"

import React, { Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import ListSearchForm from "@/components/common/ListSearchForm"
import { Button } from "@/components/ui/button"
import NewsSkeleton from "@/components/skeleton/NewsSkeleton"
import NewsList from "@/components/news/NewsList"
import CreateLinkButton from "@/components/common/CreateLinkButton"

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
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm>
        <h4 className="text-xl font-bold md:text-2xl">
          아트인포 예술 뉴스{" "}
          <span className="pl-[2px] text-main">
            {newsCount?.totalCount || "00"}
          </span>
        </h4>
      </ListSearchForm>
      {user?.type === UserType.ADMIN && (
        <div className="flex justify-end">
          <CreateLinkButton onClick={() => router.push(`${pathname}/create`)} />
        </div>
      )}
      <section>
        <Suspense fallback={<NewsSkeleton />}>
          <NewsList />
        </Suspense>
      </section>
    </div>
  )
}

export default page
