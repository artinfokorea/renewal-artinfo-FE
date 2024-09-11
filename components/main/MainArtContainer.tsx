"use client"

import { AdvertisementType } from "@/types/ads"
import Link from "next/link"
import { useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import { AspectRatio } from "../ui/aspect-ratio"
import FallbackImage from "../common/FallbackImage"

interface Props {
  type: AdvertisementType
  title: string
}

const ArtConatiner = ({ type, title }: Props) => {
  const { data: arts } = useSuspenseQuery({
    ...queries.ads.list(type),
  })

  return (
    <section className="my-12 md:my-16">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <Link href="/performances">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      {/*  Desktop Art Section */}
      <div className="mt-4 hidden grid-cols-2 gap-8 md:grid md:grid-cols-4">
        {arts?.map((art, index) => (
          <Link
            key={art.id}
            href={art.redirectUrl}
            target="_blank"
            className={`${
              index < 2 ? "block" : index < 4 ? "hidden md:block" : "hidden"
            }`}
          >
            <AspectRatio ratio={2 / 3} className="relative cursor-pointer">
              <FallbackImage
                src={art.imageUrl}
                alt="art_image"
                fill
                priority
                quality={100}
                sizes="(max-width: 768px) 100px 180px, 198px 280px"
                className="rounded-md"
              />
            </AspectRatio>
          </Link>
        ))}
      </div>
      {/*  Mobile Art Section */}
      <div className="mt-4 flex overflow-x-auto md:hidden">
        <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
          {arts?.map(art => (
            <SwiperSlide key={art.id} style={{ width: "200px" }}>
              <Link key={art.id} href={art.redirectUrl} target="_blank">
                <AspectRatio ratio={2 / 3} className="relative cursor-pointer">
                  <FallbackImage
                    src={art.imageUrl}
                    alt="art_image"
                    fill
                    priority
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

export default ArtConatiner
