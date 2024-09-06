import { performanceSchema } from "@/lib/schemas"
import { Input } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"
import { Spinner } from "../common/Loading"
import dynamic from "next/dynamic"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { PERFORMANCE_AREA, PERFORMANCE_DETAIL } from "@/types/performances"
import ImageField from "../common/ImageField"
import useToast from "@/hooks/useToast"
import { useLoading } from "@toss/use-loading"
import { uploadImages } from "@/services/system"
import { UploadTarget } from "@/types"
import FileUploader from "../common/FileUploader"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import PerformanceAreaDialog from "../dialog/PerformanceAreaDialog"
import filters from "@/lib/filters"

const CKEditor = dynamic(() => import("@/components/ckEditor/CKEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

export type PerformanceFormData = yup.InferType<typeof performanceSchema>

interface Props {
  handlePerformanceForm: (payload: PerformanceFormData) => void
  isFormLoading: boolean
  performance?: PERFORMANCE_DETAIL
}

const PerformanceForm = ({
  handlePerformanceForm,
  isFormLoading,
  performance,
}: Props) => {
  const fileUploader = useRef<HTMLInputElement>(null)
  const { successToast, errorToast } = useToast()
  const [isUploadLoading, uploadTrasition] = useLoading()
  const [isDirectInput, setIsDirectInput] = useState(false)
  const [isAreaSearchDialog, setIsAreaSearchDialog] = useState(false)
  const router = useRouter()
  const filter = filters()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PerformanceFormData>({
    resolver: yupResolver(performanceSchema),
  })

  useEffect(() => {
    if (performance) {
      setValue("title", performance?.title)
      setValue("posterImageUrl", performance?.posterImageUrl || "")
      setValue(
        "startAt",
        performance?.startAt
          ? (filter.YYYYMMDD(performance.startAt, "YYYY-MM-DD") as string)
          : "",
      )
      setValue(
        "endAt",
        performance?.endAt
          ? (filter.YYYYMMDD(performance.endAt, "YYYY-MM-DD") as string)
          : "",
      )
      setValue("time", performance?.time || "")
      setValue("customAreaName", performance?.customAreaName || "")
      setValue("area", performance?.area || null)
      setValue("age", performance?.age || "")
      setValue("ticketPrice", performance?.ticketPrice || "")
      setValue("cast", performance?.cast || "")
      setValue("host", performance?.host || "")
      setValue("reservationUrl", performance?.reservationUrl || "")
      setValue("introduction", performance?.introduction || "")
    }
  }, [performance])

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleArea = (area: PERFORMANCE_AREA) => {
    setValue("area", area)
    setValue("customAreaName", "")
    clearErrors()
  }

  const deleteImage = () => setValue("posterImageUrl", "")

  const handleUploadedFiles = async (files: File[]) => {
    try {
      const uploadResponse = await uploadTrasition(
        uploadImages(UploadTarget.USER, files, true),
      )
      successToast("공연 이미지가 등록되었습니다.")
      setValue("posterImageUrl", uploadResponse.images[0].url as string)
    } catch (error: any) {
      errorToast(error.message)
      console.log(error)
    }
  }

  return (
    <>
      <form
        className="px-2 py-4"
        onSubmit={handleSubmit(handlePerformanceForm)}
      >
        <div className="md:mt:0 mb-2">
          <Input
            {...register("title")}
            className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
            placeholder="제목을 입력해주세요."
          />
          <ErrorMessage
            errors={errors}
            name="title"
            render={({ message }) => (
              <p className="text-xs font-semibold text-error">{message}</p>
            )}
          />
        </div>
        <div className="mt-4 flex flex-col lg:flex-row">
          <div>
            <ImageField
              imageUrl={watch("posterImageUrl") || ""}
              isImageLoading={isUploadLoading}
              alt="job_company_image"
              deleteImage={deleteImage}
              openFileUploader={openFileUploader}
              className="h-[190px] w-full md:h-[300px] lg:w-[225px]"
            />
            <ErrorMessage
              errors={errors}
              name="posterImageUrl"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>

          <div className="flex flex-1 flex-col gap-[6px] py-2 lg:ml-12">
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                공연기간
              </span>
              <div className="flex-1">
                <div>
                  <Input
                    {...register("startAt")}
                    type="date"
                    className="mr-2 w-[130px] rounded border border-black"
                  />
                  ~
                  <Input
                    {...register("endAt")}
                    type="date"
                    className="ml-2 w-[130px] rounded border border-black"
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="startAt"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="endAt"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                공연장소
              </span>
              <div className="w-full flex-1 flex-col">
                <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                  {isDirectInput ? (
                    <Input
                      {...register("customAreaName")}
                      placeholder="공연장소를 입력해주세요."
                      className="w-full rounded border-2 border-whitesmoke px-2 py-1 focus:outline-none disabled:border-none disabled:bg-gray-200"
                    />
                  ) : watch("area") ? (
                    <p className="w-full">{watch("area")?.name}</p>
                  ) : (
                    <p className="w-full">{watch("customAreaName")}</p>
                  )}
                  <div className="flex w-full gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsDirectInput(false)
                        setIsAreaSearchDialog(true)
                      }}
                      className="h-8 whitespace-nowrap rounded-lg border px-2 font-medium text-main"
                    >
                      장소검색
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setValue("area", null)
                        setIsDirectInput(true)
                      }}
                      className="h-8 whitespace-nowrap rounded-lg border px-2 font-medium text-main"
                    >
                      직접입력
                    </Button>
                  </div>
                </div>
                {errors.customAreaName ? (
                  <ErrorMessage
                    errors={errors}
                    name="customAreaName"
                    render={({ message }) => (
                      <p className="text-xs font-semibold text-error">
                        {message}
                      </p>
                    )}
                  />
                ) : (
                  errors.area && (
                    <ErrorMessage
                      errors={errors}
                      name="area"
                      render={({ message }) => (
                        <p className="text-xs font-semibold text-error">
                          {message}
                        </p>
                      )}
                    />
                  )
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                공연시간
              </span>
              <div className="flex-1">
                <Input
                  {...register("time")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none"
                  placeholder="공연시간을 입력해주세요. 예) 일요일(17:00)"
                />
                <ErrorMessage
                  errors={errors}
                  name="time"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                관람연령
              </span>
              <div className="flex-1">
                <Input
                  {...register("age")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none md:basis-5/6"
                  placeholder="관람연령을 입력해주세요. 예) 12세 이상"
                />
                <ErrorMessage
                  errors={errors}
                  name="age"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                티켓가격
              </span>
              <div className="flex-1">
                <Input
                  {...register("ticketPrice")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none md:basis-5/6"
                  placeholder="티켓 가격을 입력해주세요. 예) R석 110,000원 / S석 90,000원"
                />
                <ErrorMessage
                  errors={errors}
                  name="ticketPrice"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 font-semibold text-grayfont">
                출연진
              </span>
              <div className="flex-1">
                <Input
                  {...register("cast")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none md:basis-5/6"
                  placeholder="출연진을 입력해주세요. 예) 손열음"
                />
                <ErrorMessage
                  errors={errors}
                  name="cast"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="basis-1/6 whitespace-nowrap font-semibold text-grayfont">
                주관 ∙ 주최
              </span>
              <div className="flex-1">
                <Input
                  {...register("host")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none md:basis-5/6"
                  placeholder="주관 ∙ 주최를 입력해주세요."
                />
                <ErrorMessage
                  errors={errors}
                  name="host"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="basis-1/6 whitespace-nowrap font-semibold text-grayfont">
                예매처 주소
              </span>
              <div className="flex-1">
                <Input
                  {...register("reservationUrl")}
                  className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none md:basis-5/6"
                  placeholder="예매처 주소를 입력해주세요."
                />
                <ErrorMessage
                  errors={errors}
                  name="reservationUrl"
                  render={({ message }) => (
                    <p className="text-xs font-semibold text-error">
                      {message}
                    </p>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="my-8">
          <h4 className="text-center font-medium text-grayfont md:text-xl">
            공연 소개
          </h4>
          <div className="my-6 h-[300px] md:h-[500px]">
            <CKEditor
              value={watch("introduction")}
              onChange={(value: string) => setValue("introduction", value)}
            />
            <ErrorMessage
              errors={errors}
              name="introduction"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="mt-64 flex justify-end gap-2 md:mt-16">
          <Button
            type="button"
            className="h-9 rounded-3xl border px-6 text-sm"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            disabled={isFormLoading}
            type="submit"
            className="h-9 rounded-3xl bg-main px-6 text-sm text-white"
          >
            {isFormLoading ? (
              <Spinner className="h-6 w-6" />
            ) : performance ? (
              "수정"
            ) : (
              "등록"
            )}
          </Button>
        </div>
        <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      </form>
      <PerformanceAreaDialog
        isOpen={isAreaSearchDialog}
        handleArea={handleArea}
        handleDialog={() => setIsAreaSearchDialog(!isAreaSearchDialog)}
      />
    </>
  )
}

export default PerformanceForm
