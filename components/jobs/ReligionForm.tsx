"use client";

import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { FormContext } from "./CreateContainer";
import { Input } from "@headlessui/react";
import dynamic from "next/dynamic";
import Loading from "../common/Loading";
import { Button } from "../ui/button";

const ToastEditor = dynamic(() => import("../editor/ToastEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Loading className="w-8 h-8" />
    </div>
  ),
});

const ReligionForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    errors,
    openFileUploader,
    deleteImage,
    openPostDialog,
    isPending,
    uploadedImageUrl,
    setValue,
    handleJob,
  } = useContext(FormContext);

  return (
    <form
      className="max-w-screen-lg mx-auto py-4 md:py-20 px-2 font-semibold"
      onSubmit={handleSubmit(handleJob)}
    >
      <div className="flex justify-center ">
        <Input
          {...register("title")}
          className="focus:outline-none py-2 mx-auto mb-4 "
          placeholder="제목을 입력해주세요."
        />
      </div>
      <div className="border-b-2 border border-whitesmoke w-2/3 mx-auto mb-4" />
      <div className="my-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-16 md:px-16">
        <div className="flex items-center gap-2">
          <Button className="text-sm border-whitesmoke border font-medium text-main px-4 h-8">
            전공
          </Button>
          <span>바이올린</span>
        </div>
        <div className="flex items-center gap-4">
          <Button className="text-sm border-whitesmoke border font-medium text-main px-4 h-8">
            사례비
          </Button>
          <Input
            {...register("majorIds")}
            className="border-b-2 border-whitesmoke focus:outline-none h-8 w-full font-semibold"
            placeholder="300,000"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-16  md:px-16 ">
        <div className="flex items-center my-2 gap-4">
          <Button className="text-sm border-whitesmoke border font-medium text-main px-4 h-8">
            단체명
          </Button>
          <Input
            {...register("majorIds")}
            className="border-b-2 border-whitesmoke focus:outline-none h-8 w-full"
            placeholder="단체 이름을 입력해주세요."
          />
        </div>
        <div className="flex items-center gap-4">
          <Button className="text-sm border-whitesmoke border font-medium text-main px-4 h-8">
            주소검색
          </Button>
          <Input
            {...register("majorIds")}
            className="border-b-2 border-whitesmoke focus:outline-none h-8 w-full"
            placeholder="300,000"
          />
        </div>
      </div>

      <div className="my-4 h-[300px] md:h-[500px]">
        <ToastEditor setValue={setValue} />
      </div>
    </form>
  );
};

export default ReligionForm;
