import { ScrollApiResponse } from "@/interface";
import { queries } from "@/lib/queries";
import { JOB, JobType } from "@/types/jobs";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import ObriCard from "./ObriCard";
import JobCard from "./JobCard";

const JobsList = () => {
  const searchParams = useSearchParams();
  const recruits = searchParams.getAll("recruit") as JobType[];
  const majorIds = searchParams.getAll("majorId") as string[];
  const keyword = searchParams.get("keyword") as string;
  const provinceIds = searchParams.getAll("provinceId") as string[];
  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  });

  const {
    data: jobs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery<ScrollApiResponse<JOB, "jobs">>({
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="mt-4">
      {jobs?.pages?.map((page) =>
        page?.jobs?.map((job, index) => {
          return job.type === JobType.PART_TIME ? (
            <ObriCard
              key={job.id}
              job={job}
              ref={ref}
              isLastPage={!(hasNextPage && index === page.jobs.length - 5)}
            />
          ) : (
            <JobCard
              key={job.id}
              job={job}
              ref={ref}
              isLastPage={!(hasNextPage && index === page.jobs.length - 5)}
            />
          );
        })
      )}
    </div>
  );
};

export default JobsList;
