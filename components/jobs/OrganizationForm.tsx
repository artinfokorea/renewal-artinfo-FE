import { ErrorMessage } from "@hookform/error-message";
import React, { useContext } from "react";
import { Dialog, DialogPanel, Input } from "@headlessui/react";
import Image from "next/image";
import CloseIcon from "../icons/CloseIcon";
import { Button } from "../ui/button";
import PhotoIcon from "../icons/PhotoIcon";
import PlusIcon from "../icons/PlusIcon";
import Loading from "../common/Loading";
import { useRouter } from "next/navigation";
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { CreateJobFormData, FormContext } from "./CreateContainer";
import dynamic from "next/dynamic";

const ToastEditor = dynamic(() => import("../editor/ToastEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Loading className="w-8 h-8" />
    </div>
  ),
});

const OrganizationForm = () => {
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
      className="max-w-screen-lg mx-auto py-4 md:py-8 px-2"
      onSubmit={handleSubmit(handleJob)}
    >
      <div className="flex flex-col md:flex-row">
        {uploadedImageUrl ? (
          <div className="h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md relative">
            <Image
              src={uploadedImageUrl}
              alt="job_create_image"
              fill
              quality={100}
              sizes="(max-width: 768px) 100px 190px, 198px 240px"
            />
            <Button
              className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
              onClick={deleteImage}
            >
              <CloseIcon className="w-6 h-6 text-primary" />
            </Button>
          </div>
        ) : (
          <div
            className="bg-whitesmoke h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md
          flex flex-col items-center justify-center gap-6"
          >
            <div className="flex flex-col items-center gap-2">
              <PhotoIcon className="w-12 h-12 text-dimgray" />
              <h5 className="font-bold text-sm md:text-base">
                대표 이미지를 등록해주세요.
              </h5>
            </div>
            <Button
              className="bg-white text-silver font-medium h-8 px-6"
              onClick={openFileUploader}
            >
              이미지 선택
            </Button>
          </div>
        )}
        <div className="md:ml-16 md:my-4 flex flex-col text-dimgray flex-1">
          <div className="mt-4 md:mt:0 mb-2">
            <Input
              {...register("title")}
              className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
              placeholder="제목을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="title"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="mb-2">
            <Input
              {...register("companyName")}
              className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
              placeholder="단체 이름을 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="companyName"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="my-2 flex">
            <button
              type="button"
              className="border-main rounded-2xl border px-3 py-1 flex items-center bg-main"
            >
              <PlusIcon className="w-4 h-4 text-white" />
              <span className="text-white">전공</span>
            </button>
          </div>
          <div className="flex gap-4 h-20">
            <Button
              type="button"
              onClick={openPostDialog}
              className="border text-main h-[36px]"
            >
              주소검색
            </Button>
            {watch("province") && (
              <div className="w-full">
                <Input
                  defaultValue={watch("province")}
                  className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                />
                <ErrorMessage
                  errors={errors}
                  name="province"
                  render={({ message }) => (
                    <p className="text-error font-semibold">{message}</p>
                  )}
                />
                <Input
                  {...register("detailAddress")}
                  placeholder="상세 주소를 입력해주세요."
                  className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                />
                <ErrorMessage
                  errors={errors}
                  name="detailAddress"
                  render={({ message }) => (
                    <p className="text-error font-semibold">{message}</p>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-4 h-[300px] md:h-[500px]">
        <ToastEditor setValue={setValue} />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="border rounded-3xl text-sm h-9 px-6"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          disabled={isPending}
          type="submit"
          className="rounded-3xl text-sm h-9 bg-main text-white px-6"
        >
          등록
        </Button>
      </div>
    </form>
  );
};

export default OrganizationForm;
