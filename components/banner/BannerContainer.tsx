'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

const BannerContainer = () => {
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
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="relative cursor-pointer">
              <AspectRatio ratio={4 / 1}>
                <Image
                  src="/img/placeholder-user.png"
                  alt="banner_image"
                  fill
                  quality={100}
                  className="rounded-xl"
                  sizes="(max-width: 768px) 100px 180px, 960px 240px"
                />
              </AspectRatio>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default BannerContainer;
