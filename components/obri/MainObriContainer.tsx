"use client";

import { queries } from "@/lib/queries";
import { JOB, JobType } from "@/types/jobs";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const MainObriContainer = () => {
  const { data } = useSuspenseQuery(
    queries.jobs.list({ page: 1, size: 5, types: [JobType.PART_TIME] })
  );

  return (
    <section className="my-8 md:my-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#오브리</h3>
        <Link href={`/jobs?recruit=${JobType.PART_TIME}`}>
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4 mb-12">
        {data?.jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <div className="border border-lightgrey rounded-md py-5 flex items-center text-sm md:text-lg">
              <div className="flex px-4 w-full">
                <span className="text-main font-medium basis-1/4">
                  {job.majors}
                </span>
                <span className="basis-1/4">{job.province}</span>
                <span className="whitespace-nowrap text-ellipsis overflow-hidden font-bold basis-2/4">
                  {job.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainObriContainer;
