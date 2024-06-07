"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import * as yup from "yup";
import { JobType } from "@/types/jobs";
import MajorSelectCard from "./MajorSelectCard";
import FileUploader from "../common/FileUploader";
import PhotoIcon from "../icons/PhotoIcon";
import { Button } from "../ui/button";
import Image from "next/image";
import CloseIcon from "../icons/CloseIcon";
import DaumPostcode from "react-daum-postcode";
import { Dialog, DialogPanel, Input } from "@headlessui/react";
import PlusIcon from "../icons/PlusIcon";
import Loading from "../common/Loading";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("@/components/editor/QuillEditor"), {
  loading: () => <Loading />,
  ssr: false,
});

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, "3자 이상 20자 이하로 입력해주세요.")
      .max(20, "3자 이상 20자 이하로 입력해주세요.")
      .required("제목을 입력해주세요."),
    contents: yup.string().required("내용을 입력해주세요."),
    companyName: yup
      .string()
      .min(2, "2자 이상 20자 이하로 입력해주세요.")
      .max(20, "2자 이상 20자 이하로 입력해주세요.")
      .required(),
    province: yup.string().required("지역을 선택해주세요."),
    name: yup
      .string()
      .min(2, "이름은 2글자 이상 입력해주세요.")
      .max(6, "이름은 6글자 이하로 입력해주세요.")
      .required("이름을 입력해주세요."),
    imageUrl: yup.string().required("이미지를 등록해주세요."),
    majorIds: yup.array().of(yup.number()).min(1, "전공을 선택해주세요."),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const CreateContainer = () => {
  const [createStep, setCreateStep] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState<JobType>();
  const fileUploader = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [openPostcode, setOpenPostcode] = useState(false);
  const [detailAddress, setDetailAddress] = useState("");
  const quillRef = useRef();
  const [htmlStr, setHtmlStr] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleSelectedJobType = (jobType: JobType) => {
    setCreateStep(createStep + 1);
    setSelectedJobType(jobType);
  };

  const openFileUploader = () => {
    fileUploader.current?.click();
  };

  const handleUploadedFiles = (files: File[]) => {
    setUploadedImage(files[0]);
  };

  const uploadedImageUrl = useMemo(() => {
    if (uploadedImage) {
      return URL.createObjectURL(uploadedImage);
    }
  }, [uploadedImage]);

  const completeHandler = (data: any) => {
    setValue("province", data.address);
    setOpenPostcode(false);
  };

  const style = {
    width: "350px",
    height: "500px",
    border: "1.4px solid #333333",
  };

  const handleDetailAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(e.target.value);
  };

  useEffect(() => {
    setValue("contents", htmlStr);
  }, [htmlStr]);

  return (
    <div>
      {/* {createStep === 0 && (
        <JobTypeSelectCard handleSelectedJobType={handleSelectedJobType} />
      )}
      {createStep === 1 && <MajorSelectCard />} */}
      <form className="max-w-screen-lg mx-auto py-4 md:py-8 px-2">
        <div className="flex flex-col md:flex-row">
          {uploadedImageUrl ? (
            <div className="h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md relative">
              <Image
                src={uploadedImageUrl}
                alt="job_create_image"
                fill
                quality={100}
              />
              <Button
                className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
                onClick={() => setUploadedImage(undefined)}
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
            <div className="mb-2">
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
            <div className="my-2">
              <button className="border-main rounded-2xl border px-3 py-1">
                <PlusIcon className="w-4 h-4 text-main" />
              </button>
            </div>
            <div className="flex gap-4 h-20">
              <Button
                type="button"
                onClick={() => setOpenPostcode(!openPostcode)}
                className="border text-main h-[36px]"
              >
                주소검색
              </Button>
              {watch("province") && (
                <div>
                  <Input
                    readOnly
                    defaultValue={watch("province")}
                    className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                  />
                  <Input
                    value={detailAddress}
                    onChange={handleDetailAddress}
                    placeholder="상세 주소를 입력해주세요."
                    className="border-b-2 border-whitesmoke focus:outline-none py-2 w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <QuillEditor
          quillRef={quillRef}
          htmlContent={htmlStr}
          setHtmlContent={setHtmlStr}
        />
        <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
        <Dialog
          open={openPostcode}
          onClose={() => setOpenPostcode(false)}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <DialogPanel>
            <DaumPostcode style={style} onComplete={completeHandler} />
          </DialogPanel>
        </Dialog>
      </form>
    </div>
  );
};

export default CreateContainer;
