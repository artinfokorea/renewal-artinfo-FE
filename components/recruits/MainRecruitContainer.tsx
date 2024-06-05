"use client";

import Link from "next/link";
import React from "react";

const items = [1, 2, 3];

interface Props {
  isMobile: boolean;
}

const MainRecruitContainer = ({ isMobile }: Props) => {
  return (
    <section>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#채용</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12 ">
        {items.slice(0, isMobile ? 2 : 3).map((item) => (
          <div
            key={item}
            className="border-2 border-whitesmoke h-[150px] md:h-[185px]"
          ></div>
        ))}
      </div>
    </section>
  );
};

export default MainRecruitContainer;
