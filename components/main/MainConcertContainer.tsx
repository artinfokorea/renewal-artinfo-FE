"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { AD, AdvertisementType } from "@/types/ads";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";

const MainConcertContainer = () => {
  const { data: concerts } = useSuspenseQuery(
    queries.ads.list(AdvertisementType.CONCERT)
  );
  return (
    <section className="gap-8 mt-4 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {concerts?.map((concert, index) => (
        <Link
          key={concert.id}
          href={concert.redirectUrl}
          target="_blank"
          className={`${
            index < 2 ? "block" : index < 4 ? "hidden md:block" : "hidden"
          }`}
        >
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
