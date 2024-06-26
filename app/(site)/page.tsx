"use client"

import React, { Suspense } from "react"
import BannerContainer from "@/components/main/BannerContainer"
import ConcertContainer from "@/components/main/MainConcertContainer"
import MainObriContainer from "@/components/main/MainObriContainer"
import MainJobsContainer from "@/components/main/MainJobsContainer"
import BannerSkeleton from "@/components/skeleton/BannerSkeleton"
import ConcertSkeleton from "@/components/skeleton/ConcertSkeleton"
import MainJobSkeleton from "@/components/skeleton/MainJobSkeleton"
import MainObirSkeleton from "@/components/skeleton/MainObirSkeleton"

const page = () => {
  return (
    <div className="max-w-screen-lg mx-auto h-full px-4">
      <Suspense fallback={<BannerSkeleton />}>
        <BannerContainer />
      </Suspense>
      <Suspense fallback={<ConcertSkeleton />}>
        <ConcertContainer />
      </Suspense>
      <Suspense fallback={<MainJobSkeleton />}>
        <MainJobsContainer />
      </Suspense>

      <article className="hidden md:flex bg-whitesmoke h-[100px] md:h-[120px] rounded-xl">
        <div className="max-w-screen-md mx-auto relative flex justify-center  items-center h-full">
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="w-40 h-40 bottom-2 left-0 hidden md:block absolute"
          />
          <div className="flex justify-between md:ml-40">
            <h4 className="font-bold text-base md:text-lg mx-4 md:mx-12">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create">
              <button className="px-6 md:px-8 text-sm md:text-base  py-3 md:py-[18px] rounded-xl bg-white text-main font-semibold tracking-widest">
                레슨 등록하기
              </button>
            </a>
          </div>
        </div>
      </article>
      <article className="flex md:hidden bg-whitesmoke h-[100px] md:h-[120px] rounded-xl">
        <div className="px-6 py-4 flex justify-between items-center w-full">
          <div className="text-sm flex flex-col gap-2">
            <h4 className="font-medium">
              많은 학생들이 레슨 받으려고 <br />
              기다리고 있어요.
            </h4>
            <a href="/lessons/create" className="text-main font-bold">
              레슨 등록하기
            </a>
          </div>
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="w-32 h-32"
          />
        </div>
      </article>
      <Suspense fallback={<MainObirSkeleton />}>
        <MainObriContainer />
      </Suspense>
    </div>
  )
}

export default page
