"use client"

import React from "react"

import Image from "next/image"
import { AD, AdvertisementType } from "@/types/ads"
import Link from "next/link"
import { useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import { AspectRatio } from "../ui/aspect-ratio"

const MainConcertContainer = () => {
  const { data: concerts } = useSuspenseQuery(
    queries.ads.list(AdvertisementType.CONCERT),
  )
  //
  return (
    <>
      {/*  Desktop Concert Section */}
      <section className="my-12 hidden grid-cols-2 gap-8 md:my-16 md:grid md:grid-cols-4 lg:gap-8">
        {concerts?.map((concert, index) => (
          <Link
            key={concert.id}
            href={concert.redirectUrl}
            target="_blank"
            className={`${
              index < 2 ? "block" : index < 4 ? "hidden md:block" : "hidden"
            }`}
          >
            <AspectRatio ratio={2 / 3} className="relative cursor-pointer">
              <Image
                src={`${concert.imageUrl}?v=${concert.id}`}
                alt="concert_image"
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 100px 180px, 198px 280px"
                className="rounded-md"
              />
            </AspectRatio>
          </Link>
        ))}
      </section>
      {/*  Mobile Concert Section */}
      <section className="my-12 flex overflow-x-auto md:my-16 md:hidden">
        <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
          {concerts?.map(concert => (
            <SwiperSlide key={concert.id} style={{ width: "200px" }}>
              <Link key={concert.id} href={concert.redirectUrl} target="_blank">
                <AspectRatio ratio={2 / 3} className="relative cursor-pointer">
                  <Image
                    src={`${concert.imageUrl}?v=${concert.id}`}
                    alt="concert_image"
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100px 180px, 198px 280px"
                    className="rounded-md"
                  />
                </AspectRatio>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  )
}

export default MainConcertContainer
