"use client";

import React, { Suspense, useEffect, useState } from "react";
import BannerContainer from "@/components/banner/BannerContainer";
import ConcertContainer from "@/components/concert/MainConcertContainer";
import MainObriContainer from "@/components/obri/MainObriContainer";
import MainJobsContainer from "@/components/jobs/MainJobsContainer";
import { queries } from "@/lib/queries";
import { AdvertisementType } from "@/types/ads";
import { JobType } from "@/types/jobs";
import {
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Loading from "../common/Loading";
import BannerSkeleton from "../skeleton/BannerSkeleton";
import { Skeleton } from "../ui/skeleton";
import ConcertSkeleton from "../skeleton/ConcertSkeleton";
import MainJobSkeleton from "../skeleton/MainJobSkeleton";
import MainObirSkeleton from "../skeleton/MainObirSkeleton";
// import Loading from "@/app/(site)/loading";

const MainClientContainer = () => {
  const [isMobile, setIsMobile] = useState(true);
  // const [
  //   { data: ads, isLoading: isAdsLoading },
  //   { data: concerts, isLoading: isConcertsLoading },
  //   { data: jobs, isLoading: isJobsLoading },
  //   { data: obries, isLoading: isObriesLoading },
  // ] = useSuspenseQueries({
  //   queries: [
  //     queries.ads.list(AdvertisementType.BANNER),
  //     queries.ads.list(AdvertisementType.CONCERT),
  //     queries.jobs.list({
  //       page: 1,
  //       size: 5,
  //       types: [JobType.ART_ORGANIZATION, JobType.LECTURER],
  //     }),
  //     queries.jobs.list({ page: 1, size: 5, types: [JobType.PART_TIME] }),
  //   ],
  // });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = (event: any) => {
      setIsMobile(!event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // if (isAdsLoading || isConcertsLoading || isJobsLoading || isObriesLoading) {
  //   return <Loading />;
  // }

  return (
    <div className="max-w-screen-lg mx-auto h-full px-2">
      <Suspense fallback={<BannerSkeleton />}>
        <BannerContainer />
      </Suspense>

      <Suspense fallback={<ConcertSkeleton />}>
        <ConcertContainer />
      </Suspense>
      <Suspense fallback={<MainJobSkeleton />}>
        <MainJobsContainer isMobile={isMobile} />
      </Suspense>

      <article className="bg-whitesmoke h-[100px] md:h-[120px] rounded-xl">
        <div className="max-w-screen-md mx-auto  relative flex justify-center md:justify-end items-center h-full">
          <img
            src="/img/instruments.png"
            alt="instruments_image"
            className="w-40 h-40 bottom-2 left-0 hidden md:block absolute"
          />
          <div className="flex justify-between">
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
      <Suspense fallback={<MainObirSkeleton />}>
        <MainObriContainer />
      </Suspense>
    </div>
  );
};

export default MainClientContainer;
