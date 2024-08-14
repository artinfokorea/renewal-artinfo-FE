"use client"

import React, { useEffect, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { AdvertisementType } from "@/types/ads"
import Link from "next/link"
import { useSuspenseQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"
import FallbackImage from "../common/FallbackImage"

const BannerContainer = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, loop: true }),
  )

  useEffect(() => {
    const NaverIdLogin = (window as any).naver
    console.log("NaverIdLogin", NaverIdLogin)
  }, [])

  const { data: ads } = useSuspenseQuery({
    ...queries.ads.list(AdvertisementType.BANNER),
  })

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
              <div className="relative aspect-[4/1] w-full">
                <FallbackImage
                  src={ad.imageUrl}
                  alt="banner_image"
                  priority
                  fill
                  className="rounded-xl"
                  sizes="100vw"
                />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default BannerContainer
