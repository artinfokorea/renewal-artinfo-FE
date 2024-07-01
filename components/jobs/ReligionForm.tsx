"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Input } from "@headlessui/react"
import dynamic from "next/dynamic"
import Loading from "../common/Loading"
import { Button } from "../ui/button"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"
import { Badge } from "../ui/badge"
import CloseIcon from "../icons/CloseIcon"
import MajorDialog from "../dialog/MajorDialog"
import PostCodeDialog from "../dialog/PostCodeDialog"
import PlusIcon from "../icons/PlusIcon"
import { MAJOR } from "@/types/majors"
import { JOB } from "@/types/jobs"

const ToastEditor = dynamic(() => import("../editor/ToastEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] flex items-center justify-center">
      <Loading className="w-8 h-8" />
    </div>
  ),
})

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
    detailAddress: yup.string().nullable(),
    majors: yup
      .array()
      .min(1, "전공을 최소 1개 선택해야 합니다.")
      .max(1, "전공은 하나만 선택할 수 있습니다.")
      .required("전공을 선택해주세요."),
    fee: yup
      .number()
      .typeError("숫자만 입력 가능합니다.")
      .required("사례비를 입력해주세요."),
  })
  .required()

export type CreateReligionFormData = yup.InferType<typeof schema>

interface Props {
  handleReligionJob: (payload: CreateReligionFormData) => void
  isLoading: boolean
  job?: JOB
}

const ReligionForm = ({ handleReligionJob, isLoading, job }: Props) => {
  const router = useRouter()
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const [isPostDialog, setIsPostDialog] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateReligionFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      majors: job?.majors || [],
      title: job?.title || "",
      companyName: job?.companyName || "",
      detailAddress: job?.address?.split("")[1] || "",
      contents: job?.contents || "",
      province: job?.address?.split(" ")[0] || "",
    },
  })

  useEffect(() => {
    if (watch("majors").length > 1) {
      setValue("majors", [watch("majors")[watch("majors").length - 1]])
    }
    clearErrors("majors")
  }, [watch("majors")])

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    if (watch("majors").includes(selectedMajor)) {
      setValue(
        "majors",
        watch("majors").filter(major => major !== selectedMajor),
      )
    } else {
      setValue("majors", [...watch("majors"), selectedMajor])
    }
  }

  return (
    <form
      className="max-w-screen-lg mx-auto py-8 px-2 font-semibold text-sm"
      onSubmit={handleSubmit(handleReligionJob)}
    >
      <h2 className="text-center md:text-2xl my-4 md:my-12 font-bold">
        채용 등록
      </h2>
      <div className="flex-col mb-2">
        <Input
          {...register("title")}
          className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full md:w-1/2"
          placeholder="제목을 입력해주세요."
        />
        <ErrorMessage
          errors={errors}
          name="title"
          render={({ message }) => (
            <p className="text-error text-xs font-semibold">{message}</p>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row my-2">
        <div className="flex-row my-2 items-center gap-1 flex flex-wrap md:mb-0">
          <Button
            type="button"
            onClick={() => setIsMajorDialog(!isMajorDialog)}
            className="border text-main h-8 text-sm rounded-full flex gap-1"
          >
            <PlusIcon className="w-4 h-4 text-main" />
            <span>전공</span>
          </Button>
          {watch("majors").map(major => (
            <Badge key={major.id} className="bg-main text-white text-sm h-8">
              {major.koName}
              <button onClick={() => handleSelectMajor(major)} className="ml-1">
                <CloseIcon className="w-4 h-4 mb-[1px] text-white" />
              </button>
            </Badge>
          ))}
          <ErrorMessage
            errors={errors}
            name="majors"
            render={({ message }) => (
              <p className="text-error text-xs font-semibold">{message}</p>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="md:basis-1/2 flex items-center my-2 gap-4 md:gap-8 md:px-6">
          <span className="text-sm font-medium text-main whitespace-nowrap">
            단체명
          </span>

          <Input
            {...register("companyName")}
            className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full"
            placeholder="단체 이름을 입력해주세요."
          />
          <ErrorMessage
            errors={errors}
            name="companyName"
            render={({ message }) => (
              <p className="text-error text-xs font-semibold">{message}</p>
            )}
          />
        </div>

        <div className="md:basis-1/2 flex items-center gap-4">
          <span className="text-sm font-medium text-main whitespace-nowrap">
            사례비
          </span>
          <Input
            {...register("fee")}
            placeholder="100000"
            type="number"
            className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full md:w-1/2"
          />
          <ErrorMessage
            errors={errors}
            name="fee"
            render={({ message }) => (
              <p className="text-error text-xs font-semibold">{message}</p>
            )}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-center my-2 md:my-0 gap-2">
          <Button
            onClick={() => setIsPostDialog(!isPostDialog)}
            type="button"
            className="text-sm border-whitesmoke border font-medium text-main px-4 h-9"
          >
            주소검색
          </Button>
          <Input
            {...register("province")}
            className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full"
            placeholder="주소 검색을 해주세요."
          />
          <Input
            {...register("detailAddress")}
            className="focus:outline-none p-2 border border-whitesmoke rounded-lg w-full"
            placeholder="상세 주소를 입력해주세요."
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="province"
          render={({ message }) => (
            <p className="text-error text-xs font-semibold">{message}</p>
          )}
        />
      </div>

      <div className="my-4 h-[300px] md:h-[500px]">
        <ToastEditor setValue={setValue} />
      </div>
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors")}
        handleSelectMajor={handleSelectMajor}
        multiple={false}
      />
      <PostCodeDialog
        isOpen={isPostDialog}
        close={() => setIsPostDialog(!isPostDialog)}
        setValue={address => setValue("province", address)}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="border rounded-3xl text-sm h-9 px-6"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button
          disabled={isLoading}
          type="submit"
          className="rounded-3xl text-sm h-9 bg-main text-white px-6"
        >
          등록
        </Button>
      </div>
    </form>
  )
}

export default ReligionForm
