"use client";

import { ScrollApiResponse } from "@/interface";
import { queries } from "@/lib/queries";
import { LESSON } from "@/types/lessons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import ListSearchForm from "../common/ListSearchForm";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import CloseIcon from "../icons/CloseIcon";
import ProvinceDialog from "../dialog/ProvinceDialog";
import MajorCheckBoxes from "../common/MajorCheckBoxes";
import MobileFilterTab from "../common/MobileFIlterTab";
import LessonCard from "./LessonCard";

const LessonListContainer = () => {
  const searchParams = useSearchParams();
  const majorIds = searchParams.getAll("majorId") as string[];
  const keyword = searchParams.get("keyword") as string;
  const provinceIds = searchParams.getAll("provinceId") as string[];
  const router = useRouter();
  const [isProvinceDialog, setIsProvinceDialog] = useState(false);
  const pathname = usePathname();

  const {
    data: lessons,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ScrollApiResponse<LESSON, "lessons">>({
    ...queries.lessons.infiniteList({
      size: 10,
      keyword,
      majorIds: majorIds.map((id) => Number(id)),
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

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 0.5,
  });

  const totalCount = lessons?.pages?.reduce((acc, page) => {
    return acc + page.totalCount;
  }, 0);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      <ListSearchForm
        totalCount={totalCount}
        title="명의의 전문가가
        준비중이에요."
      />
      <section className="flex">
        <form className="hidden lg:flex flex-col text-gray-400 min-w-[180px]">
          <MajorCheckBoxes majors={majors?.majors} />
        </form>
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
            page="LESSON"
          />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            {lessons?.pages?.map((page) =>
              page?.lessons?.map((lesson, index) => {
                return (
                  <LessonCard
                    lesson={lesson}
                    key={lesson.id}
                    isLastPage={
                      !(hasNextPage && index === page.lessons.length - 5)
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

export default LessonListContainer;
