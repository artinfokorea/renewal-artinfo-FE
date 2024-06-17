"use client";

import { queries } from "@/lib/queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import Loading from "../common/Loading";
import Image from "next/image";
import filters from "@/lib/filters";
import ClipBoardIcon from "../icons/ClipBoardIcon";
import useToast from "@/hooks/useToast";
import { clipboard } from "@toss/utils";
import { SchoolType, SchoolTypeValues } from "@/types/lessons";
import { Badge } from "../ui/badge";

const LessonDetailContainer = () => {
  const [isPhoneShow, setIsPhoneShow] = useState(false);
  const params = useParams();
  const filter = filters();
  const { successToast } = useToast();

  const { data: lesson } = useQuery(queries.lessons.detail(Number(params.id)));
  console.log("lesson", lesson);

  const copyToPhone = async () => {
    const isSuccess = await clipboard.writeText(lesson?.phone as string);

    if (isSuccess) {
      successToast("연락처가 복사되었습니다.");
    }
  };
  return (
    <Suspense fallback={<Loading />}>
      <div className="mt-8 md:mt-16">
        <div className="flex flex-col md:flex-row md:gap-24">
          {lesson?.imageUrl && (
            <div className="h-[360px] md:h-[300px] relative w-[300px] md:w-[240px] mx-auto">
              <Image
                src={lesson?.imageUrl}
                alt="lesson_image"
                fill
                quality={100}
                className="rounded-md"
                sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
              />
            </div>
          )}
          <div className="flex-1 p-6 md:p-0">
            <h4 className="text-xl md:text-2xl font-bold">{lesson?.name}</h4>
            <div className="mt-6 grid md:grid-cols-2 gap-y-4 gap-x-10">
              <div className="flex  gap-4 text-base md:text-lg items-center">
                <span className="font-bold">전공</span>
                <div>
                  {lesson?.majors?.map((major, index) => (
                    <Badge
                      key={major}
                      className="text-main text-xs md:text-sm bg-aliceblue rounded-xl mx-1"
                    >
                      {major}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-base md:text-lg items-center">
                <span className="font-bold">가격</span>
                <div>
                  <span className="font-medium">
                    {filter.FEECOMMA(lesson?.pay as number)}원
                  </span>
                  <span className="text-xs"> (1회)</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-base md:text-lg">
                <span className="font-bold">학력</span>

                {lesson?.schools?.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center gap-6 md:gap-12 mb-2"
                  >
                    <img
                      src={
                        school.type === SchoolType.UNDERGRADUATE
                          ? "/icon/bachelor.png"
                          : school.type === SchoolType.MASTER
                          ? "/icon/master.png"
                          : "/icon/doctor.png"
                      }
                      alt="school_image"
                      className="w-[30px] h-[30px]"
                    />
                    <div>
                      <h5 className="font-semibold text-base text-primary">
                        {school.name}
                      </h5>
                      <p className="text-coolgray text-sm">
                        {SchoolTypeValues[school.type]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 text-base md:text-lg items-center">
                  <span className="font-bold">연락처</span>
                  {isPhoneShow ? (
                    <div className="flex items-center font-medium ml-4">
                      <span>{lesson?.phone}</span>
                      <button onClick={copyToPhone}>
                        <ClipBoardIcon className="w-4 pb-1 ml-2" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-main font-semibold"
                      onClick={() => setIsPhoneShow(!isPhoneShow)}
                    >
                      연락처보기
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-base md:text-lg">
                  <span className="font-bold">지역</span>
                  <div>
                    {lesson?.areas?.map((area, index) => (
                      <span key={area}>
                        {index === lesson.areas.length - 1 ? area : `${area}, `}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-4 gap-4 md:flex-row md:gap-8 mt-6 md:mt-12">
          <div className="md:w-1/2 bg-whitesmoke rounded-md p-8 min-h-[200px] md:h-[380px] overflow-y-auto">
            <p className="text-coolgray font-semibold text-lg mb-6">
              전문가 소개
            </p>
            {lesson?.introduction}
          </div>
          <div className="md:w-1/2 bg-whitesmoke rounded-md p-8 min-h-[200px] md:h-[380px] overflow-y-auto">
            <p className="text-coolgray font-semibold text-lg mb-6">경력</p>
            {lesson?.career}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LessonDetailContainer;
