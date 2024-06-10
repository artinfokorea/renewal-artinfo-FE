"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { AD } from "@/types/ads";
import Link from "next/link";

interface Props {
  isMobile: boolean;
  concerts?: AD[];
}

const MainConcertContainer = ({ isMobile, concerts }: Props) => {
  return (
    <section className="py-6 gap-8 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {concerts?.slice(0, isMobile ? 2 : 4).map((concert) => (
        <Link key={concert.id} href={concert.redirectUrl} target="_blank">
          <div className="border border-silver h-[240px] md:h-[280px] relative">
            <Image
              src={concert.imageUrl}
              alt="concert_image"
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 100px 180px, 198px 280px"
            />
          </div>
        </Link>
      ))}
    </section>
  );
};

export default MainConcertContainer;
