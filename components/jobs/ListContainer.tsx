"use client";

import React, { useEffect, useState } from "react";
import ListSearchForm from "./ListSearchForm";
import ListCheckBoxes from "./ListCheckBoxes";
import { MajorType, JobType, MajorValues, JOB } from "@/types/jobs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import MobileSearchTab from "./MobileSearchTab";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { ScrollApiResponse } from "@/interface";
import JobCard from "./JobCard";
import ObriCard from "./ObriCard";

const ListContainer = () => {
  const searchParams = useSearchParams();
  const recruits = searchParams.get("recruit") as JobType;
  const majors = searchParams.get("major") as MajorType;
  const keyword = searchParams.get("keyword") as string;
  const router = useRouter();
  const [checkedRecruits, setCheckedRecruits] = useState<JobType[]>(
    recruits ? recruits.split(",").map((item) => item as JobType) : []
  );

  const [checkedMajors, setCheckedMajors] = useState<MajorType[]>(
    majors ? majors.split(",").map((item) => item as MajorType) : []
  );

  const { data: jobs } = useInfiniteQuery<ScrollApiResponse<JOB, "jobs">>({
    ...queries.jobs.infiniteList({
      page: 1,
      size: 20,
      types: checkedRecruits,
      keyword,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) return lastPage.nextPage;
    },
  });

  const totalCount = jobs?.pages?.reduce((acc, page) => {
    return acc + page.totalCount;
  }, 0);

  useEffect(() => {
    setCheckedRecruits(recruits ? (recruits.split(",") as JobType[]) : []);
  }, [recruits]);

  useEffect(() => {
    setCheckedMajors(majors ? (majors.split(",") as MajorType[]) : []);
  }, [majors]);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ListSearchForm totalCount={totalCount} />
      <section className="flex">
        <ListCheckBoxes
          checkedRecruits={checkedRecruits}
          checkedMajors={checkedMajors}
        />
        <div className="md:flex-1 w-full flex flex-col md:ml-12 md:mt-4">
          <div className="hidden md:flex justify-between items-center">
            <div>
              {checkedRecruits.map((recruit) => (
                <Badge
                  key={recruit}
                  className="text-main text-sm border-lightgray rounded py-1 px-3 ml-2 mb-2"
                >
                  {recruit}
                </Badge>
              ))}
              {checkedMajors.map((major) => (
                <Badge
                  key={major}
                  className="text-main text-sm border-lightgray rounded py-1 px-3 ml-2 mb-2"
                >
                  {major}
                </Badge>
              ))}
            </div>
            <Button
              className="py-2 px-6 text-white bg-main rounded-3xl"
              onClick={() => router.push("/jobs/create")}
            >
              등록
            </Button>
          </div>
          <MobileSearchTab />
          <div className="mt-4">
            {jobs?.pages?.map((page) =>
              page?.jobs?.map((job) => {
                return job.type === JobType.PART_TIME ? (
                  <ObriCard key={job.id} job={job} />
                ) : (
                  <JobCard key={job.id} job={job} />
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListContainer;
