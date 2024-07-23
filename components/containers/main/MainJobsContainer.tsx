"use client"

import { queries } from "@/lib/queries"
import { JobType } from "@/types/jobs"
import { useSuspenseQuery } from "@tanstack/react-query"
import Link from "next/link"
import React, { memo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import FallbackImage from "../../common/FallbackImage"
import { AspectRatio } from "../../ui/aspect-ratio"
import { ProfessionalFieldTypes } from "@/types/majors"

const MainJobsContainer = () => {
  const { data } = useSuspenseQuery(
    queries.jobs.list({
      page: 1,
      size: 5,
      types: [JobType.ART_ORGANIZATION, JobType.LECTURER],
      professionalFields: [
        ProfessionalFieldTypes.CLASSIC,
        ProfessionalFieldTypes.POPULAR_MUSIC,
        ProfessionalFieldTypes.TRADITIONAL_MUSIC,
        ProfessionalFieldTypes.ADMINISTRATION,
      ],
    }),
  )

  console.log("3")
  return (
    <section className="my-12 md:my-16">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#채용</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      {/* // Desktop Job Section */}
      <div className="mb-12 mt-4 hidden grid-cols-2 md:grid md:grid-cols-3 md:gap-8">
        {data?.jobs?.map((job, index) => (
          <Link
            key={job.title}
            href={`/jobs/${job.id}`}
            className={`${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <AspectRatio
              ratio={5 / 3}
              className="relative cursor-pointer rounded-lg border-2 border-whitesmoke"
            >
              <FallbackImage
                src={job.imageUrl}
                alt={`${job.companyName}_job_image`}
                fill
                fallbackText={job.companyName}
                quality={100}
                sizes="(max-width: 768px) 100px 130px, (max-width: 1200px) 200px, 185px"
                className="rounded-lg"
              />
            </AspectRatio>
          </Link>
        ))}
      </div>
      {/* // Mobile Job Section */}
      <div className="mb-12 mt-4 flex overflow-x-auto md:hidden">
        <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
          {data?.jobs.map(job => (
            <SwiperSlide key={job.id} style={{ width: "150px" }}>
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <AspectRatio
                  ratio={5 / 3}
                  className="relative cursor-pointer rounded-lg border-2 border-whitesmoke"
                >
                  <FallbackImage
                    src={job.imageUrl}
                    alt={`${job.companyName}_job_image`}
                    fill
                    priority
                    fallbackText={job.companyName}
                    quality={100}
                    sizes="(max-width: 768px) 100px 180px, 198px 280px"
                    className="rounded-md"
                  />
                </AspectRatio>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default MainJobsContainer
