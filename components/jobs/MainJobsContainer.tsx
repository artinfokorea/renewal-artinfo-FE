"use client";

import { JOB } from "@/types/jobs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  isMobile: boolean;
  jobs?: JOB[];
}

const MainJobsContainer = ({ isMobile, jobs }: Props) => {
  return (
    <section>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#채용</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12 ">
        {jobs?.slice(0, isMobile ? 2 : 3).map((job) => (
          <div
            key={job.title}
            className="border-2 border-whitesmoke h-[130px] md:h-[185px] relative"
          >
            <Link href={`/jobs/${job.id}`}>
              <Image
                src={job.imageUrl}
                alt="job_image"
                fill
                quality={100}
                sizes="(max-width: 768px) 100px 130px, (max-width: 1200px) 200px, 185px"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainJobsContainer;
