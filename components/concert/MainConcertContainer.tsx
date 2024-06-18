"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { AD, AdvertisementType } from "@/types/ads";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

interface Props {
  isMobile: boolean;
}

const MainConcertContainer = ({ isMobile }: Props) => {
  const { data: concerts } = useSuspenseQuery(
    queries.ads.list(AdvertisementType.CONCERT)
  );
  return (
    <section className="py-6 gap-8 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {concerts?.slice(0, isMobile ? 2 : 4).map((concert) => (
        <Link key={concert.id} href={concert.redirectUrl} target="_blank">
          <div className="h-[240px] md:h-[280px] relative">
            <Image
              src={concert.imageUrl}
              alt="concert_image"
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100px 180px, 198px 280px"
              className="rounded-md"
            />
          </div>
        </Link>
      ))}
    </section>
  );
};

export default MainConcertContainer;
