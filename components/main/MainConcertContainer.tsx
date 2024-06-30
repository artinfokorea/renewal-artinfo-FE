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
  return (
    <>
      <section className="hidden md:grid gap-8 my-12 md:my-16 lg:gap-8  grid-cols-2 md:grid-cols-4">
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
                src={concert.imageUrl}
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
      <section className="my-12 md:my-16 flex md:hidden overflow-x-auto">
        <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
          {concerts?.map(concert => (
            <SwiperSlide key={concert.id} style={{ width: "200px" }}>
              <Link key={concert.id} href={concert.redirectUrl} target="_blank">
                <AspectRatio ratio={2 / 3} className="relative cursor-pointer">
                  <Image
                    src={concert.imageUrl}
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
