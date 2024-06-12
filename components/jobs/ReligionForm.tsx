"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useContext } from "react";
import { FormContext } from "./CreateContainer";
import { Input } from "@headlessui/react";
import dynamic from "next/dynamic";
import Loading from "../common/Loading";
import { Button } from "../ui/button";
import { useHookFormMask } from "use-mask-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useController,
  useForm,
} from "react-hook-form";
import filters from "@/lib/filters";
import { MAJOR } from "@/types";
import { Badge } from "../ui/badge";
import CloseIcon from "../icons/CloseIcon";

const ToastEditor = dynamic(() => import("../editor/ToastEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Loading className="w-8 h-8" />
    </div>
  ),
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
    detailAddress: yup.string().required("상세 주소를 입력해주세요."),
    majorIds: yup.array().of(yup.number()).min(1, "전공을 선택해주세요."),
    fee: yup.number().required("사례비를 입력해주세요."),
  })
  .required();

export type CreateReligionFormData = yup.InferType<typeof schema>;

interface Props {
  handleMajorDialog: () => void;
  selectedMajors: MAJOR[];
  handleSelectMajor: (major: MAJOR) => void;
}

const ReligionForm = ({
  handleMajorDialog,
  selectedMajors,
  handleSelectMajor,
}: Props) => {
  const router = useRouter();
  const filter = filters();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,

    formState: { errors, isValid },
  } = useForm<CreateReligionFormData>({
    resolver: yupResolver(schema),
  });

  const {
    field: { onChange, value },
  } = useController({
    name: "fee",
    control,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = filter.FEECOMMA(event.target.value);
    onChange(maskedValue);
  };

  return (
    <form
      className="max-w-screen-lg mx-auto py-4 md:py-20 px-2 font-semibold text-sm"
      //   onSubmit={handleSubmit(handleJob)}
    >
      <div className="flex mb-2">
        <Input
          {...register("title")}
          className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full md:w-1/2"
          placeholder="제목을 입력해주세요."
        />
      </div>
      <div className="flex flex-col md:flex-row my-2">
        <div className="md:basis-1/2 items-center gap-1 flex flex-wrap">
          <Button
            type="button"
            onClick={handleMajorDialog}
            className="text-sm font-medium bg-main text-white rounded-full px-3 h-7"
          >
            전공추가
          </Button>
          {selectedMajors.map((major) => (
            <Badge key={major.id} className="bg-main text-white text-sm">
              {major.koName}
              <button onClick={() => handleSelectMajor(major)}>
                <CloseIcon className="w-4 h-4 ml-1 text-white" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="md:basis-1/2 flex items-center gap-4">
          <span className="text-sm font-medium text-main">사례비</span>
          <Input
            value={value}
            onChange={handleChange}
            placeholder="100,000"
            type="type"
            className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full md:w-1/2"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:basis-1/2 flex items-center my-2 gap-4">
          <span className="text-sm font-medium text-main whitespace-nowrap">
            단체명
          </span>
          <Input
            {...register("majorIds")}
            className="border-b-2 border-whitesmoke focus:outline-none h-8 w-full"
            placeholder="단체 이름을 입력해주세요."
          />
        </div>
        <div className="md:basis-1/2 flex items-center gap-4">
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
