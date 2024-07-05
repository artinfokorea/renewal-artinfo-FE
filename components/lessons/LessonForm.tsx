"use client"

import React, { FormEvent, useEffect, useRef, useState } from "react"
import FileUploader from "../common/FileUploader"
import { Button, Input, Textarea } from "@headlessui/react"
import CloseIcon from "../icons/CloseIcon"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { usePathname, useRouter } from "next/navigation"
import * as yup from "yup"
import DistrictDialog from "../dialog/DistrictDialog"
import useToast from "@/hooks/useToast"
import { LESSON } from "@/types/lessons"
import { ErrorMessage } from "@hookform/error-message"
import ImageField from "../common/ImageField"
import { Spinner } from "../common/Loading"
import { lessonSchema } from "@/lib/schemas"
import useImageCompress from "@/hooks/useImageCompress"

export type LessonFormData = yup.InferType<typeof lessonSchema>

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
  const { compressAndUpload, isUploadLoading } = useImageCompress()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: yupResolver(lessonSchema),
    defaultValues: {
      areas: lesson?.areas || [],
      pay: lesson?.pay,
      imageUrl: lesson?.imageUrl,
      introduction: lesson?.introduction,
      career: lesson?.career,
    },
  })

  const autoResizeIntro = (element: HTMLTextAreaElement) => {
    if (element) {
      element.style.height = "auto"
      element.style.height = `${element.scrollHeight}px`
    }
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const textarea = document.querySelector('textarea[name="introduction"]')
      if (textarea) {
        autoResizeIntro(textarea as HTMLTextAreaElement)
      }
    })

    const textarea = document.querySelector('textarea[name="introduction"]')
    if (textarea) {
      resizeObserver.observe(textarea)
    }

    return () => {
      if (textarea) {
        resizeObserver.unobserve(textarea)
      }
    }
  }, [])

  const autoResizeCareer = (element: HTMLTextAreaElement) => {
    if (element) {
      element.style.height = "auto"
      element.style.height = `${element.scrollHeight}px`
    }
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const textarea = document.querySelector('textarea[name="career"]')
      if (textarea) {
        autoResizeCareer(textarea as HTMLTextAreaElement)
      }
    })

    const textarea = document.querySelector('textarea[name="career"]')
    if (textarea) {
      resizeObserver.observe(textarea)
    }

    return () => {
      if (textarea) {
        resizeObserver.unobserve(textarea)
      }
    }
  }, [])

  const deleteImage = () => setValue("imageUrl", "")

  const handleArea = (area: string) => {
    const currentAreas = Array.from(watch("areas") || [])

    if (currentAreas?.includes(area)) {
      const filteredAreas = currentAreas.filter((prev: string) => prev !== area)
      setValue("areas", filteredAreas)
    } else {
      let newAreas

      if (currentAreas.length >= 3) {
        newAreas = [...currentAreas.slice(1), area]
      } else {
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
      const uploadResponse = await compressAndUpload(files)
      successToast("프로필 이미지가 등록되었습니다.")
      setValue("imageUrl", uploadResponse.images[0].url as string)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  return (
    <>
      <form className="mt-8 px-4 md:mt-16">
        <div className="flex flex-col md:flex-row md:gap-24">
          <ImageField
            imageUrl={watch("imageUrl") || ""}
            isImageLoading={isUploadLoading}
            alt="job_company_image"
            priority={true}
            deleteImage={deleteImage}
            openFileUploader={openFileUploader}
            className="mx-auto h-[360px] w-[300px] rounded-md md:h-[300px] md:w-[240px]"
          />
          <div className="flex-1 p-2 md:p-0">
            <h4 className="text-xl font-bold md:text-2xl">레슨 등록</h4>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-6 text-sm md:text-lg">
                <span className="font-bold">가격</span>
                <div className="flex items-center whitespace-nowrap">
                  <Input
                    {...register("pay")}
                    type="number"
                    className="mr-1 w-full rounded-lg border px-2 py-1 focus:outline-none md:w-[200px]"
                  />
                  <span className="text-lg">원</span>
                  <span className="text-xs leading-6">(1회)</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm md:text-lg">
                <span className="whitespace-nowrap font-bold">지역</span>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setIsDistrictDialog(!isDistrictDialog)}
                    className="h-8 whitespace-nowrap rounded-lg border px-2 font-medium text-main"
                  >
                    지역 등록
                  </Button>
                  <span className="text-xs font-medium text-silver md:text-base">
                    지역은 최대 3개까지 등록 가능합니다.
                  </span>
                </div>
              </div>
              <ul className="h-32 w-full rounded-lg border p-2 md:w-1/2">
                {watch("areas")?.map((area: string) => (
                  <li key={area} className="flex items-center gap-2">
                    <span>{area}</span>{" "}
                    <button onClick={() => handleArea(area)}>
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="my-8 border-b-2 border-whitesmoke" />
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="rounded-md bg-whitesmoke p-4 md:w-1/2 md:p-8">
            <p className="mb-3 font-semibold text-coolgray md:mb-6 md:text-lg">
              전문가 소개
            </p>
            <Textarea
              {...register("introduction")}
              placeholder="전문가 소개를 입력해주세요."
              onInput={(e: FormEvent<HTMLTextAreaElement>) =>
                autoResizeIntro(e.target as HTMLTextAreaElement)
              }
              className="min-h-[300px] w-full resize-none overflow-y-hidden rounded-lg border p-3 text-sm focus:outline-none md:text-lg"
            />
            <ErrorMessage
              errors={errors}
              name="introduction"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error md:basis-1/2">
                  {message}
                </p>
              )}
            />
          </div>
          <div className="rounded-md bg-whitesmoke p-4 md:w-1/2 md:p-8">
            <p className="mb-3 font-semibold text-coolgray md:mb-6 md:text-lg">
              경력
            </p>
            <Textarea
              {...register("career")}
              placeholder="경력 사항을 입력해주세요."
              onInput={(e: FormEvent<HTMLTextAreaElement>) =>
                autoResizeCareer(e.target as HTMLTextAreaElement)
              }
              className="h-auto min-h-[300px] w-full resize-none overflow-y-hidden rounded-lg border p-3 text-sm focus:outline-none md:text-lg"
            />
            <ErrorMessage
              errors={errors}
              name="career"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error md:basis-1/2">
                  {message}
                </p>
              )}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <Button
            onClick={() =>
              router.push(pathname.slice(0, pathname.lastIndexOf("/")))
            }
            type="button"
            className="w-20 rounded-full border-[3px] py-1 font-semibold"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handleLesson)}
            disabled={isFormLoading}
            className="w-20 rounded-full bg-main px-6 font-semibold text-white"
          >
            {isFormLoading ? (
              <Spinner className="h-6 w-6" />
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
