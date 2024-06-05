"use client";

import { JOB, RecruitType } from "@/types/jobs";
import Link from "next/link";
import React from "react";

interface Props {
  jobs?: JOB[];
}

const MainObriContainer = ({ jobs }: Props) => {
  return (
    <section className="my-8 md:my-12">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">#오브리</h3>
        <Link href={`/jobs?recruit=${RecruitType.PART_TIME}`}>
          <h5 className="font-bold text-silver">더보기</h5>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4 mb-12">
        {jobs?.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <div className="border border-lightgrey rounded-md py-5 flex items-center">
              <div className="grid grid-cols-4 px-4 gap-3">
                <span className="text-main font-medium">{job.majors}</span>
                <span>{job.province}</span>
                <span className="whitespace-nowrap text-ellipsis overflow-hidden font-bold col-span-2">
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
