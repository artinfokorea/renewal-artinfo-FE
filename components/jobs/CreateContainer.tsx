"use client";

import React, { useState } from "react";
import { JobType } from "@/types/jobs";
import useToast from "@/hooks/useToast";
import { createFullTimeJob, createReligionJob } from "@/apis/jobs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OrganizationForm, { CreateJobFormData } from "./OrganizationForm";
import ReligionForm, { CreateReligionFormData } from "./ReligionForm";
import JobTypeSelectCard from "./JobTypeSelectCard";
import { useLoading } from "@toss/use-loading";
import { uploadImage } from "@/apis/system";

const CreateContainer = () => {
  const searchParams = useSearchParams();
  const jobType = searchParams.get("jobType");
  const pathname = usePathname();
  const router = useRouter();
  const { errorToast, successToast } = useToast();
  const [isLoading, startTransition] = useLoading();

  const handleFullTimeJob = async (payload: CreateJobFormData) => {
    const {
      title,
      companyName,
      province,
      detailAddress,
      imageFile,
      majors,
      contents,
    } = payload;
    try {
      const imageUrl = await startTransition(uploadImage([imageFile as File]));

      await startTransition(
        createFullTimeJob({
          title,
          companyName,
          province: `${province} ${detailAddress}`,
          imageUrl,
          majorIds: majors?.map((id) => Number(id)),
          contents,
        })
      );
      successToast("채용이 등록되었습니다.");
      router.push(pathname.slice(0, pathname.lastIndexOf("/")));
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const handleReligionJob = async (payload: CreateReligionFormData) => {
    const {
      title,
      contents,
      companyName,
      province,
      detailAddress,
      majors,
      fee,
    } = payload;
    try {
      await startTransition(
        createReligionJob({
          title,
          companyName,
          address: `${province} ${detailAddress}`,
          majorId: majors[0].id as number,
          contents,
          fee,
        })
      );
      successToast("채용이 등록되었습니다.");
      router.push(pathname.slice(0, pathname.lastIndexOf("/")));
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  // const handleImageUpload = async (file: File) => {
  //   try {}
  // }

  return (
    <section>
      {!jobType && (
        <JobTypeSelectCard
          handleSelectedJobType={(jobType: JobType) =>
            router.push(`${pathname}?jobType=${jobType}`)
          }
        />
      )}
      {jobType === JobType.RELIGION && (
        <ReligionForm
          handleReligionJob={handleReligionJob}
          isLoading={isLoading}
        />
      )}
      {jobType && jobType !== JobType.RELIGION && (
        <OrganizationForm
          handleFullTimeJob={handleFullTimeJob}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};

export default CreateContainer;
