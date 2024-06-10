"use client";

import React, { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { AD } from "@/types/ads";
import Link from "next/link";

interface Props {
  ads?: AD[];
}

const BannerContainer = ({ ads }: Props) => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, loop: true })
  );

  return (
    <Carousel
      className="w-full my-4"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {ads?.map((ad) => (
          <CarouselItem key={ad.id}>
            <Link href={ad.redirectUrl} target="_blank">
              <AspectRatio ratio={4 / 1} className="relative cursor-pointer">
                <Image
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
  );
};

export default BannerContainer;
