"use client";

import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import FileUploader from "../common/FileUploader";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import useToast from "@/hooks/useToast";
import { uploadImages } from "@/apis/system";
import { useLoading } from "@toss/use-loading";
import { Button, Input, Textarea } from "@headlessui/react";
import PhotoIcon from "../icons/PhotoIcon";
import CloseIcon from "../icons/CloseIcon";
import { useQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { createLesson, getLessonQualification } from "@/apis/lessons";
import { AxiosError } from "axios";
import ConfirmDialog from "../common/ConfirmDialog";

const schema = yup
  .object({
    introduction: yup.string().required("소개를 입력해주세요."),
    career: yup.string().required("경력 사항을 입력해주세요."),
    pay: yup.number().required("1회당 금액을 입력해주세요."),
    areas: yup
      .array()
      .min(1, "한개 이상의 지역을 등록해주세요.")
      .required("레슨 가능한 지역을 등록해주세요."),
    imageUrl: yup.string().required("이미지를 등록해주세요."),
  })
  .required();

export type LessonFormData = yup.InferType<typeof schema>;

const LessonForm = () => {
  const fileUploader = useRef<HTMLInputElement>(null);
  const { successToast, errorToast } = useToast();
  const [isImageUploadLoading, imageStartTransition] = useLoading();
  const [isHandleFormLoading, handleFormTransition] = useLoading();
  const [isQualificationDialog, setIsQualificationDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   imageUrl: "/img/placeholder-user.png",
    // },
  });

  const { data: provinceList } = useQuery(queries.provinces.list());

  const openFileUploader = () => {
    fileUploader.current?.click();
  };

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await imageStartTransition(
        uploadImages(files as File[])
      );
      successToast("프로필 이미지가 등록되었습니다.");
      setValue("imageUrl", uploadResponse.images[0].url as string);
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  const handleLessonForm = async (payload: LessonFormData) => {
    try {
      await handleFormTransition(createLesson(payload));
    } catch (error: any) {
      errorToast(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getLessonQualification()
      .then((res) => console.log("res", res))
      .catch((error: AxiosError) => {
        if (error.response?.status === 403) {
          setIsQualificationDialog(true);
        }
      });
  }, []);

  return (
    <form className="mt-8 md:mt-16 px-4">
      <div className="flex flex-col md:flex-row md:gap-24">
        {watch("imageUrl") ? (
          <div className="h-[360px] md:h-[300px] relative w-[300px] md:w-[240px] mx-auto">
            <Image
              src={watch("imageUrl")}
              alt="lesson_image"
              fill
              quality={100}
              className="rounded-md"
              sizes="(max-width: 768px) 100px 180px, (max-width: 1200px) 200px, 200px"
            />
            <Button
              className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
              onClick={() => setValue("imageUrl", "")}
            >
              <CloseIcon className="w-6 h-6 text-primary" />
            </Button>
          </div>
        ) : (
          <div
            className="h-[360px] md:h-[300px] w-[300px] md:w-[240px] mx-auto bg-whitesmoke rounded
      flex flex-col items-center justify-center gap-6
      "
          >
            <div className="flex flex-col items-center gap-2">
              <PhotoIcon className="w-14 h-14 text-dimgray" />
              <h5 className="font-bold text-sm md:text-base text-center">
                프로필 이미지를 <br />
                등록해 주세요.
              </h5>
            </div>
            <Button
              type="button"
              className="bg-white text-silver font-medium h-8 px-6"
              onClick={openFileUploader}
            >
              이미지 선택
            </Button>
          </div>
        )}

        <div className="flex-1 p-2 md:p-0">
          <h4 className="text-xl md:text-2xl font-bold">레슨 등록</h4>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-6 text-base md:text-lg items-center">
              <span className="font-bold">가격</span>
              <div className="flex whitespace-nowrap items-center">
                <Input
                  {...register("pay")}
                  type="number"
                  className="border px-2 py-1 mr-1 rounded-lg focus:outline-none w-full md:w-[200px]"
                />
                <span className="text-lg">원</span>
                <span className="text-xs leading-6">(1회)</span>
              </div>
            </div>
            <div className="flex gap-6 items-center text-base md:text-lg">
              <span className="font-bold">지역</span>
              <Button className="text-main font-medium border px-2 h-8 rounded-lg">
                지역 등록
              </Button>
            </div>
            <div className="border rounded-lg h-32 w-full md:w-1/2 p-2">
              hihi
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 mt-6 md:mt-12">
        <div className="md:w-1/2 bg-whitesmoke rounded-md py-8 px-10 h-[380px] overflow-y-auto">
          <p className="text-coolgray font-semibold text-lg mb-6">
            전문가 소개
          </p>
          <Textarea
            {...register("introduction")}
            className="border p-3 rounded-lg resize-none focus:outline-none w-full h-4/5"
          />
        </div>
        <div className="md:w-1/2 bg-whitesmoke rounded-md py-8 px-10 h-[380px] overflow-y-auto">
          <p className="text-coolgray font-semibold text-lg mb-6">경력</p>
          <Textarea
            {...register("career")}
            className="border p-3 rounded-lg resize-none focus:outline-none w-full h-4/5"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <Button
          onClick={() =>
            router.push(pathname.slice(0, pathname.lastIndexOf("/")))
          }
          type="button"
          className="border-[3px] rounded-full font-semibold w-20 py-1"
        >
          취소
        </Button>
        <Button
          disabled={isHandleFormLoading}
          className="bg-main text-white rounded-full font-semibold px-6 w-20"
        >
          등록
        </Button>
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <ConfirmDialog
        title="레슨 등록 권한이 없습니다."
        description="내 프로필에서 학력, 전공 등의 정보를 입력해주세요."
        isOpen={isQualificationDialog}
        handleDialog={() => router.push("/my-profile")}
      />
    </form>
  );
};

export default LessonForm;
