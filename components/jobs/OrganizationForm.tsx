import { ErrorMessage } from "@hookform/error-message"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogPanel, Input } from "@headlessui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import dynamic from "next/dynamic"
import * as yup from "yup"
import FileUploader from "../common/FileUploader"
import CloseIcon from "../icons/CloseIcon"
import { Button } from "../ui/button"
import PhotoIcon from "../icons/PhotoIcon"
import PlusIcon from "../icons/PlusIcon"
import Loading from "../common/Loading"
import MajorDialog from "../dialog/MajorDialog"
import { Badge } from "../ui/badge"
import PostCodeDialog from "../dialog/PostCodeDialog"
import { MAJOR } from "@/types/majors"
import { JOB } from "@/types/jobs"
import { uploadImages } from "@/apis/system"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"

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
    detailAddress: yup.string().required("상세 주소를 입력해주세요."),
    imageUrl: yup.string().required("이미지를 등록해주세요."),
    majors: yup
      .array()
      .min(1, "전공을 최소 1개 선택해야 합니다.")
      .max(3, "전공은 최대 3개까지 선택 할 수 있습니다.")
      .required("전공을 선택해주세요."),
  })
  .required()

export type CreateJobFormData = yup.InferType<typeof schema>

interface Props {
  handleFullTimeJob: (payload: CreateJobFormData) => void
  isLoading: boolean
  job?: JOB
}

const OrganizationForm = ({ handleFullTimeJob, isLoading, job }: Props) => {
  const router = useRouter()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const [isPostDialog, setIsPostDialog] = useState(false)
  const [isImageLoading, imageLoadingTransition] = useLoading()
  const { successToast, errorToast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      majors: job?.majors?.majors || ([] as MAJOR[]),
      title: job?.title || "",
      companyName: job?.companyName || "",
      detailAddress: job?.address?.split("")[1] || "",
      contents: job?.contents || "",
      province: job?.address?.split(" ")[0] || "",
      imageUrl: job?.imageUrl || "",
    },
  })

  console.log("job.a", job?.address)
  console.log("pro", watch("province"))

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await imageLoadingTransition(
        uploadImages(files as File[]),
      )
      successToast("프로필 이미지가 등록되었습니다.")
      setValue("imageUrl", uploadResponse.images[0].url as string)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    const majorIds = watch("majors")?.map(major => major.id)

    if (majorIds?.includes(selectedMajor.id)) {
      setValue(
        "majors",
        watch("majors")?.filter(major => major.id !== selectedMajor.id),
      )
    } else {
      const mergedMajors = [...watch("majors"), selectedMajor]

      setValue("majors", mergedMajors.slice(-3))
    }
  }

  console.log("pro", watch("province"))

  return (
    <form
      className="max-w-screen-lg mx-auto py-4 px-2"
      onSubmit={handleSubmit(handleFullTimeJob)}
    >
      <h2 className="text-center md:text-2xl my-4 md:my-12 font-bold">
        채용 등록
      </h2>
      <div className="flex flex-col md:flex-row">
        {watch("imageUrl") ? (
          <div className="h-[190px] md:h-[244px] w-full md:w-[400px] rounded-md relative">
            <Image
              src={watch("imageUrl")}
              alt="job_create_image"
              fill
              quality={100}
              sizes="(max-width: 768px) 100px 190px, 198px 240px"
            />
            <Button
              className="absolute top-2 right-2 rounded-full opacity-40 bg-white p-2"
              onClick={() => setValue("imageUrl", "")}
            >
              <CloseIcon className="w-6 h-6 text-primary" />
            </Button>
          </div>
        ) : isImageLoading ? (
          <div className="h-[190px] md:h-[244px] w-full md:w-[400px] flex justify-center items-center">
            <Loading className="w-10 h-10" />
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
              type="button"
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
                <p className="text-error text-xs font-semibold">{message}</p>
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
                <p className="text-error text-xs font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="my-2 flex items-center gap-1 md:gap-2">
            <Button
              type="button"
              onClick={() => setIsMajorDialog(!isMajorDialog)}
              className="border text-main h-8 text-sm rounded-full flex gap-1"
            >
              <PlusIcon className="w-4 h-4 text-main" />
              <span>전공</span>
            </Button>
            {!errors.majors && watch("majors").length == 0 && (
              <span className="text-silver text-sm">
                전공은 최대 3개까지 선택 가능합니다.
              </span>
            )}
            {watch("majors").map((major: MAJOR) => (
              <Badge
                key={major.id}
                className="bg-main text-white text-xs md:text-sm h-8 whitespace-nowrap"
              >
                {major.koName}
                <button
                  onClick={() => handleSelectMajor(major)}
                  className="ml-1"
                >
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
          <div className="flex gap-4 h-20">
            <Button
              type="button"
              onClick={() => setIsPostDialog(!isPostDialog)}
              className="border text-main h-8 text-sm"
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
                    <p className="text-error text-xs font-semibold">
                      {message}
                    </p>
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
                    <p className="text-error text-xs font-semibold">
                      {message}
                    </p>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-4 h-[300px] md:h-[500px]">
        <ToastEditor setValue={setValue} value={job?.contents} />
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
          disabled={isLoading}
          type="submit"
          className="rounded-3xl text-sm h-9 bg-main text-white px-6"
        >
          등록
        </Button>
      </div>
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <MajorDialog
        open={isMajorDialog}
        close={() => setIsMajorDialog(!isMajorDialog)}
        selectedMajors={watch("majors")}
        handleSelectMajor={handleSelectMajor}
        multiple={true}
      />
      <PostCodeDialog
        isOpen={isPostDialog}
        close={() => setIsPostDialog(!isPostDialog)}
        setValue={address => {
          setValue("province", address)
          clearErrors("province")
        }}
      />
    </form>
  )
}

export default OrganizationForm
