"use client"

import React, { Suspense } from "react"
import ListSearchForm from "../common/ListSearchForm"
import { Loading } from "../common/Loading"
import NewsList from "./NewsList"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { UserType } from "@/types/users"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"

const NewsContainer = () => {
  const { data: user } = useQuery(queries.users.detail())
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm>
        <h4 className="text-xl font-bold md:text-2xl">
          아트인포 예술 뉴스 <span className="pl-[2px] text-main">00</span>
        </h4>
      </ListSearchForm>
      {user?.type === UserType.ADMIN && (
        <div className="flex justify-end px-4">
          <Button
            className="rounded-3xl bg-main px-6 py-2 text-white"
            onClick={() => router.push(`${pathname}/create`)}
          >
            등록
          </Button>
        </div>
      )}
      <section>
        <Suspense fallback={<Loading />}>
          <NewsList />
        </Suspense>
      </section>
    </div>
  )
}

export default NewsContainer
