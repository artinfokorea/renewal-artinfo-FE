"use client";

import React, { useState } from "react";
import { JobType } from "@/types/jobs";
import useToast from "@/hooks/useToast";
import {
  createFullTimeJob,
  createPartTimeJob,
  createReligionJob,
} from "@/apis/jobs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import OrganizationForm, { CreateJobFormData } from "./OrganizationForm";
import ReligionForm, { CreateReligionFormData } from "./ReligionForm";
import JobTypeSelectDialog from "./JobTypeSelectDIalog";
import { useLoading } from "@toss/use-loading";
import { uploadImages } from "@/apis/system";
import ObriForm, { CreateObriFormData } from "./ObriForm";
import { useQueryClient } from "@tanstack/react-query";

const CreateContainer = () => {
  const searchParams = useSearchParams();
  const jobType = searchParams.get("jobType");
  const pathname = usePathname();
  const router = useRouter();
  const { errorToast, successToast } = useToast();
  const [isLoading, startTransition] = useLoading();
  const queryClient = useQueryClient();

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
      const uploadResponse = await startTransition(
        uploadImages([imageFile] as File[])
      );

      await startTransition(
        createFullTimeJob({
          title,
          companyName,
          province: `${province} ${detailAddress}`,
          imageUrl: uploadResponse.images[0].url as string,
          majorIds: majors.map((major) => major.id),
          contents,
        })
      );
      successToast("채용이 등록되었습니다.");
      router.push(pathname.slice(0, pathname.lastIndexOf("/")));
      queryClient.invalidateQueries({
        queryKey: ["jobs", "infiniteList"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["jobs", "infiniteList"],
      });
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const handlePartTimeJob = async (payload: CreateObriFormData) => {
    const {
      title,
      contents,
      startAt,
      endAt,
      fee,
      majors,
      detailAddress,
      address,
      companyName,
    } = payload;
    try {
      await startTransition(
        createPartTimeJob({
          title,
          companyName,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
          address: `${address} ${detailAddress}`,
          majorId: majors[0].id as number,
          contents,
          fee,
        })
      );
      successToast("채용이 등록되었습니다.");
      router.push(pathname.slice(0, pathname.lastIndexOf("/")));
      queryClient.invalidateQueries({
        queryKey: ["jobs", "infiniteList"],
      });
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  return (
    <section>
      {!jobType && (
        <JobTypeSelectDialog
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
      {jobType === JobType.PART_TIME && (
        <ObriForm handlePartTimeJob={handlePartTimeJob} isLoading={isLoading} />
      )}
      {(jobType === JobType.ART_ORGANIZATION ||
        jobType === JobType.LECTURER) && (
        <OrganizationForm
          handleFullTimeJob={handleFullTimeJob}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};

export default CreateContainer;
