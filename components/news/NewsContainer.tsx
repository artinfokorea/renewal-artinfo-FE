"use client"

import React, { Suspense } from "react"
import ListSearchForm from "../common/ListSearchForm"
import { Loading } from "../common/Loading"
import NewsList from "./NewsList"

const NewsContainer = () => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <ListSearchForm>
        <h4 className="text-xl font-bold md:text-2xl">
          아트인포 예술 뉴스 <span className="pl-[2px] text-main">00</span>
        </h4>
      </ListSearchForm>
      <section>
        <Suspense fallback={<Loading />}>
          <NewsList />
        </Suspense>
      </section>
    </div>
  )
}

export default NewsContainer
