"use client";

import { queries } from "@/lib/queries";
import { JOB, JobType } from "@/types/jobs";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  isMobile: boolean;
}

const MainJobsContainer = ({ isMobile }: Props) => {
  const { data } = useSuspenseQuery(
    queries.jobs.list({
      page: 1,
      size: 5,
      types: [JobType.ART_ORGANIZATION, JobType.LECTURER],
    })
  );
  return (
    <section>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#채용</h3>
        <Link href="/jobs">
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-4 mb-12 ">
        {data?.jobs?.map((job, index) => (
          <Link
            key={job.title}
            href={`/jobs/${job.id}`}
            className={`${
              index < 2 ? "block" : index < 3 ? "hidden md:block" : "hidden"
            }`}
          >
            <div className="border-2 border-whitesmoke h-[130px] md:h-[185px] relative">
              <Image
                src={job.imageUrl}
                alt="job_image"
                fill
                quality={100}
                sizes="(max-width: 768px) 100px 130px, (max-width: 1200px) 200px, 185px"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainJobsContainer;
