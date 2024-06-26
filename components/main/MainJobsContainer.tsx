"use client";

import { queries } from "@/lib/queries";
import { JobType } from "@/types/jobs";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";

const MainJobsContainer = () => {
  const { data } = useSuspenseQuery(
    queries.jobs.list({
      page: 1,
      size: 5,
      types: [JobType.ART_ORGANIZATION, JobType.LECTURER],
    })
  );
  return (
    <section className="my-8 md:my-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#채용</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12 ">
        {data?.jobs?.map((job, index) => (
          <Link
            key={job.title}
            href={`/jobs/${job.id}`}
            className={`${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="border-2 border-whitesmoke h-[130px] md:h-[185px] relative rounded-lg">
              <Image
                src={job.imageUrl}
                alt="job_image"
                fill
                quality={100}
                sizes="(max-width: 768px) 100px 130px, (max-width: 1200px) 200px, 185px"
                className="rounded-lg"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex md:hidden overflow-x-auto mt-4 mb-12">
        <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
          {data?.jobs.map((job) => (
            <SwiperSlide key={job.id} style={{ width: "150px" }}>
              <Link key={job.id} href={`/jobs/${job.id}`} target="_blank">
                <div className="border-2 border-whitesmoke h-[100px] md:h-[185px] relative rounded-lg">
                  <Image
                    src={job.imageUrl}
                    alt="job_image"
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100px 180px, 198px 280px"
                    className="rounded-md"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default MainJobsContainer;
