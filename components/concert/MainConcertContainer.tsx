"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

const items = [1, 2, 3, 4];

interface Props {
  isMobile: boolean;
}

const MainConcertContainer = ({ isMobile }: Props) => {
  return (
    <section className="py-6 gap-8 lg:gap-12 grid grid-cols-2 md:grid-cols-4">
      {items.slice(0, isMobile ? 2 : 4).map((item) => (
        <div
          key={item}
          className="border border-silver h-[240px] md:h-[280px]  relative"
        >
          <Image
            src="/img/placeholder-user.png"
            alt="concert1"
            fill
            quality={100}
          />
        </div>
      ))}
    </section>
  );
};

export default MainConcertContainer;
