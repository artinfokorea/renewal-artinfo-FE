"use client";

import Loading from "@/app/(site)/jobs/[id]/loading";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import filters from "@/lib/filters";

const DetailContainer = () => {
  const params = useParams();
  const filter = filters();

  const { data: job } = useQuery(queries.jobs.detail(Number(params.id)));
  console.log("job", job);

  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-4">
        <div className="flex">
          {job?.imageUrl && (
            <div className="h-[244px] relative w-[400px]">
              <Image
                src={job?.imageUrl}
                alt="job_image"
                fill
                quality={100}
                sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
              />
            </div>
          )}
          <div className="ml-4 md:ml-12 py-2 flex-1 flex flex-col justify-center gap-2">
            <h4 className="text-base md:text-xl font-bold break-keep">
              {job?.title}
            </h4>
            <div className="flex my-2 items-center text-xs md:text-sm">
              {job?.majors?.map((major) => (
                <Badge
                  key={major}
                  className="text-main text-xs md:text-sm bg-aliceblue rounded-xl mr-1"
                >
                  {major}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between text-coolgray text-sm md:text-base">
              <span>{job?.companyName}</span>
              <span>{filter.YYYYMMDD(job?.endAt)}</span>
            </div>
          </div>
        </div>
        <div>button</div>
        {job?.contents && (
          <div dangerouslySetInnerHTML={{ __html: job.contents }}></div>
        )}
      </div>
    </Suspense>
  );
};

export default DetailContainer;
