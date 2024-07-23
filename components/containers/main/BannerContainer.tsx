"use client"

import React, { memo, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { AspectRatio } from "../../ui/aspect-ratio"
import { AdvertisementType } from "@/types/ads"
import Link from "next/link"
import { useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import FallbackImage from "../../common/FallbackImage"

const BannerContainer = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, loop: true }),
  )

  const { data: ads } = useSuspenseQuery(
    queries.ads.list(AdvertisementType.BANNER),
  )

  console.log("1")
  return (
    <Carousel
      className="my-6 w-full md:my-16"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {ads?.map(ad => (
          <CarouselItem key={ad.id}>
            <Link href={ad.redirectUrl} target="_blank">
              <AspectRatio ratio={4 / 1} className="relative cursor-pointer">
                <FallbackImage
                  src={ad.imageUrl}
                  alt="banner_image"
                  fill
                  priority
                  quality={100}
                  className="rounded-xl"
                  sizes="(max-width: 768px) 100px 180px, 960px 240px"
                />
              </AspectRatio>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default BannerContainer
