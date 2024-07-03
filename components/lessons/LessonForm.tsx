"use client"

import React, { useRef, useState } from "react"
import FileUploader from "../common/FileUploader"
import { Button, Input, Textarea } from "@headlessui/react"
import CloseIcon from "../icons/CloseIcon"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { usePathname, useRouter } from "next/navigation"
import * as yup from "yup"
import DistrictDialog from "../dialog/DistrictDialog"
import useToast from "@/hooks/useToast"
import { uploadImages } from "@/apis/system"
import { LESSON } from "@/types/lessons"
import { useLoading } from "@toss/use-loading"
import { ErrorMessage } from "@hookform/error-message"
import ImageField from "../common/ImageField"
import { Spinner } from "../common/Loading"

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
  .required()

export type LessonFormData = yup.InferType<typeof schema>

interface Props {
  isFormLoading: boolean
  handleLesson: (payload: LessonFormData) => void
  lesson?: LESSON
}

const LessonForm = ({ handleLesson, isFormLoading, lesson }: Props) => {
  const fileUploader = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { successToast, errorToast } = useToast()
  const [isDistrictDialog, setIsDistrictDialog] = useState(false)
  const [isImageLoading, imageLoadingTransition] = useLoading()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      areas: lesson?.areas || [],
      pay: lesson?.pay,
      imageUrl: lesson?.imageUrl,
      introduction: lesson?.introduction,
      career: lesson?.career,
    },
  })

  const deleteImage = () => setValue("imageUrl", "")

  const handleArea = (area: string) => {
    const currentAreas = Array.from(watch("areas") || [])

    if (currentAreas?.includes(area)) {
      const filteredAreas = currentAreas.filter((prev: string) => prev !== area)
      setValue("areas", filteredAreas)
    } else {
      let newAreas

      if (currentAreas.length >= 3) {
        // 이미 3개가 선택되어 있다면, 첫 번째 항목을 제거하고 새 항목을 추가합니다.
        newAreas = [...currentAreas.slice(1), area]
      } else {
        // 3개 미만이라면 그냥 추가합니다.
        newAreas = [...currentAreas, area]
      }

      setValue("areas", newAreas)
    }
  }

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

  return (
    <>
      <form className="mt-8 md:mt-16 px-4">
        <div className="flex flex-col md:flex-row md:gap-24">
          <ImageField
            imageUrl={watch("imageUrl") || ""}
            isImageLoading={isImageLoading}
            alt="job_company_image"
            deleteImage={deleteImage}
            openFileUploader={openFileUploader}
            className="h-[360px] md:h-[300px] w-[300px] md:w-[240px] mx-auto"
          />
          <div className="flex-1 p-2 md:p-0">
            <h4 className="text-xl md:text-2xl font-bold">레슨 등록</h4>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex gap-6 text-sm md:text-lg items-center">
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
              <div className="flex gap-6 items-center text-sm md:text-lg">
                <span className="font-bold whitespace-nowrap">지역</span>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsDistrictDialog(!isDistrictDialog)}
                    className="text-main font-medium border px-2 h-8 rounded-lg whitespace-nowrap"
                  >
                    지역 등록
                  </Button>
                  <span className="text-silver font-medium text-xs md:text-base">
                    지역은 최대 3개까지 등록 가능합니다.
                  </span>
                </div>
              </div>
              <ul className="border rounded-lg h-32 w-full md:w-1/2 p-2">
                {watch("areas")?.map((area: string) => (
                  <li key={area} className="flex items-center gap-2">
                    <span>{area}</span>{" "}
                    <button onClick={() => handleArea(area)}>
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-whitesmoke border-b-2 my-8 " />
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="md:w-1/2 bg-whitesmoke rounded-md p-4 md:p-8 h-[380px] overflow-y-auto">
            <p className="text-coolgray font-semibold md:text-lg mb-3 md:mb-6">
              전문가 소개
            </p>
            <Textarea
              {...register("introduction")}
              placeholder="전문가 소개를 입력해주세요."
              className="border p-3 rounded-lg resize-none text-sm md:text-lg focus:outline-none w-full h-4/5"
            />
            <ErrorMessage
              errors={errors}
              name="introduction"
              render={({ message }) => (
                <p className="text-error text-xs font-semibold md:basis-1/2">
                  {message}
                </p>
              )}
            />
          </div>
          <div className="md:w-1/2 bg-whitesmoke rounded-md p-4 md:p-8 h-[380px] overflow-y-auto">
            <p className="text-coolgray font-semibold md:text-lg mb-3 md:mb-6">
              경력
            </p>
            <Textarea
              {...register("career")}
              placeholder="경력 사항을 입력해주세요."
              className="border p-3 rounded-lg resize-none text-sm md:text-lg focus:outline-none w-full h-4/5"
            />
            <ErrorMessage
              errors={errors}
              name="career"
              render={({ message }) => (
                <p className="text-error text-xs font-semibold md:basis-1/2">
                  {message}
                </p>
              )}
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
            type="button"
            onClick={handleSubmit(handleLesson)}
            disabled={isFormLoading}
            className="bg-main text-white rounded-full font-semibold px-6 w-20"
          >
            {isFormLoading ? (
              <Spinner className="w-6 h-6" />
            ) : lesson ? (
              "수정"
            ) : (
              "등록"
            )}
          </Button>
        </div>
        <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      </form>
      <DistrictDialog
        open={isDistrictDialog}
        close={() => setIsDistrictDialog(false)}
        handleArea={handleArea}
      />
    </>
  )
}

export default LessonForm
