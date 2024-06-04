"use client";

import Link from "next/link";
import React from "react";

const MainObriContainer = () => {
  return (
    <section className="my-8 md:my-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#오브리</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4 mb-12">
        <div className="border border-silver h-20"></div>
        <div className="border border-silver h-20"></div>
        <div className="border border-silver h-20"></div>
        <div className="border border-silver h-20"></div>
      </div>
    </section>
  );
};

export default MainObriContainer;
