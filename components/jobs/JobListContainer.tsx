"use client";

import React, { useEffect, useState, useMemo } from "react";
import ListSearchForm from "../common/ListSearchForm";
import JobListCheckBoxes from "./JobListCheckBoxes";
import { useInView } from "react-intersection-observer";
import { JobType, JOB } from "@/types/jobs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { ScrollApiResponse } from "@/interface";
import JobCard from "./JobCard";
import ObriCard from "./ObriCard";
import ProvinceDialog from "../dialog/ProvinceDialog";
import CloseIcon from "../icons/CloseIcon";
import MobileFilterTab from "../common/MobileFIlterTab";

const ListContainer = () => {
  const searchParams = useSearchParams();
  const recruits = searchParams.getAll("recruit") as JobType[];
  const majorIds = searchParams.getAll("majorId") as string[];
  const keyword = searchParams.get("keyword") as string;
  const provinceIds = searchParams.getAll("provinceId") as string[];
  const router = useRouter();
  const pathname = usePathname();
  const [isProvinceDialog, setIsProvinceDialog] = useState(false);

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  });

  const {
    data: jobs,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ScrollApiResponse<JOB, "jobs">>({
    ...queries.jobs.infiniteList({
      size: 10,
      types: recruits,
      keyword,
      categoryIds: majorIds.map((id) => Number(id)),
      provinceIds: provinceIds.map((id) => Number(id)),
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isLast) return lastPage.nextPage;
      return null;
    },
  });

  const { data: majors } = useQuery(queries.majors.list());

  const { data: provinceList } = useQuery(queries.provinces.list());

  const selectedProvinces = useMemo(() => {
    return provinceList?.provinces?.filter((province) =>
      provinceIds.includes(province.id.toString())
    );
  }, [provinceIds]);

  const totalCount = jobs?.pages?.reduce((acc, page) => {
    return acc + page.totalCount;
  }, 0);

  const deleteProvince = (provinceId: string) => {
    const locationParams = new URLSearchParams(window.location.search);
    if (provinceIds.includes(provinceId)) {
      const newProvinceIds = provinceIds.filter((id) => id !== provinceId);

      locationParams.delete("provinceId");
      newProvinceIds.forEach((id) => {
        locationParams.append("provinceId", id);
      });
    }

    const newUrl = `${window.location.pathname}?${locationParams.toString()}`;
    router.push(newUrl, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ListSearchForm
        totalCount={totalCount}
        title="개의 채용이
        진행중이에요."
      />
      <section className="flex">
        <JobListCheckBoxes majors={majors?.majors} />
        <div className="md:flex-1 w-full flex flex-col md:ml-12 md:mt-4">
          <div className="hidden lg:flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setIsProvinceDialog(!isProvinceDialog)}
                className="text-main text-sm border border-lightgray rounded px-4 h-7"
              >
                지역선택
              </Button>
              {selectedProvinces?.map((province) => (
                <Badge
                  key={province.id}
                  className="text-main text-sm border-lightgray rounded h-7 flex items-center"
                >
                  <span>{province.name.slice(0, 2)}</span>
                  <button
                    onClick={() => deleteProvince(province.id.toString())}
                  >
                    <CloseIcon className="w-4 h-4 pb-[1px]" />
                  </button>
                </Badge>
              ))}
            </div>
            <Button
              className="py-2 px-6 text-white bg-main rounded-3xl"
              onClick={() => router.push(`${pathname}/create`)}
            >
              등록
            </Button>
          </div>
          <MobileFilterTab
            majors={majors?.majors}
            provinces={provinceList?.provinces}
            page="JOB"
          />
          <div className="mt-4">
            {jobs?.pages?.map((page) =>
              page?.jobs?.map((job, index) => {
                return job.type === JobType.PART_TIME ? (
                  <ObriCard
                    key={job.id}
                    job={job}
                    ref={ref}
                    isLastPage={
                      !(hasNextPage && index === page.jobs.length - 5)
                    }
                  />
                ) : (
                  <JobCard
                    key={job.id}
                    job={job}
                    ref={ref}
                    isLastPage={
                      !(hasNextPage && index === page.jobs.length - 5)
                    }
                  />
                );
              })
            )}
          </div>
        </div>
        <ProvinceDialog
          provinces={provinceList?.provinces}
          open={isProvinceDialog}
          close={() => setIsProvinceDialog(false)}
          multiple
        />
      </section>
    </div>
  );
};

export default ListContainer;
