import React, { useState } from "react"
import { partTimeSchema } from "@/lib/schemas"
import { JOB } from "@/types/jobs"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import PlusIcon from "../icons/PlusIcon"
import TrashIcon from "../icons/TrashIcon"
import { MAJOR } from "@/types/majors"
import dynamic from "next/dynamic"
import { Spinner } from "../common/Loading"
import { Badge } from "../ui/badge"
import PartTimeMajorDialog from "../dialog/PartTimeMajorDialog"
import PostCodeDialog from "../dialog/PostCodeDialog"

export type PartTimeFormData = yup.InferType<typeof partTimeSchema>

const CKEditor = dynamic(() => import("@/components/ckEditor/CKEditor"), {
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
  ssr: false,
})

interface PartTimeFormProps {
  isLoading: boolean
  handleSubmitForm: (payload: PartTimeFormData) => void
  partTime?: JOB
}

export const PartTimeForm = ({
  isLoading,
  handleSubmitForm,
  partTime,
}: PartTimeFormProps) => {
  const router = useRouter()
  const [isPostDialog, setIsPostDialog] = useState(false)
  const [isMajorDialog, setIsMajorDialog] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PartTimeFormData>({
    resolver: yupResolver(partTimeSchema),
    defaultValues: {
      title: partTime?.title,
      companyName: partTime?.companyName,
      fee: partTime?.fee,
      address: partTime?.address,
      addressDetail: partTime?.addressDetail,
      contents: partTime?.contents,
      schedules: partTime
        ? partTime?.schedules?.map(schedule => {
            const startDate = new Date(schedule.startAt)
            const endDate = new Date(schedule.endAt)

            return {
              date: startDate.toISOString().split("T")[0],
              startTime: startDate.toTimeString().slice(0, 5),
              endTime: endDate.toTimeString().slice(0, 5),
            }
          })
        : [{ date: "", startTime: "", endTime: "" }],
      majors: partTime ? partTime.majors?.majors : [],
    },
  })

  const handleSelectMajor = (selectedMajor: MAJOR) => {
    const majorIds = watch("majors")?.map(major => major.id)

    if (majorIds?.includes(selectedMajor.id)) {
      setValue(
        "majors",
        watch("majors")?.filter(major => major.id !== selectedMajor.id),
      )
    } else {
      const mergedMajors = [...(watch("majors") || []), selectedMajor]

      setValue("majors", mergedMajors)
    }
  }

  return (
    <form
      className="mt-8 px-4 md:mt-16"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <h4 className="text-center text-xl font-bold md:text-2xl">구인 등록</h4>
      <div className="md:my-8">
        <div className="md:mt:0 mb-2">
          <Input
            {...register("title")}
            className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none"
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
        <div className="md:mt:0 mb-2">
          <Input
            {...register("companyName")}
            className="w-full border-b-2 border-whitesmoke py-1 focus:outline-none"
            placeholder="단체 이름을 입력해주세요."
          />
          <ErrorMessage
            errors={errors}
            name="companyName"
            render={({ message }) => (
              <p className="text-xs font-semibold text-error">{message}</p>
            )}
          />
        </div>
        <div className="mt-2 flex items-center gap-6 text-sm md:mt-6 md:text-lg">
          <span className="text-sm font-bold text-grayfont md:text-base">
            금액
          </span>
          <div className="flex items-center whitespace-nowrap">
            <Input
              {...register("fee")}
              type="number"
              className="mr-1 w-full rounded-lg border px-2 focus:outline-none md:w-[200px]"
            />
            <span className="text-lg">원</span>
            <span className="text-xs leading-6">(1회)</span>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2 md:mt-6 md:flex-row">
          <Button
            type="button"
            onClick={() => setIsPostDialog(!isPostDialog)}
            className="flex h-9 whitespace-nowrap rounded-lg border p-2 font-medium text-main"
          >
            <span>주소검색</span>
          </Button>
          <div className="w-full">
            <Input
              disabled
              value={watch("address")}
              placeholder="주소검색을 통해 주소를 입력해주세요."
              className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none disabled:bg-white"
            />
            <ErrorMessage
              errors={errors}
              name="address"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
            <Input
              {...register("addressDetail")}
              placeholder="상세 주소를 입력해주세요."
              className="w-full border-b-2 border-whitesmoke py-2 focus:outline-none"
            />
            <ErrorMessage
              errors={errors}
              name="addressDetail"
              render={({ message }) => (
                <p className="text-xs font-semibold text-error">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2 md:mt-6 md:flex-row">
          <Button
            onClick={() => {
              setValue("schedules", [
                ...watch("schedules"),
                { date: "", startTime: "", endTime: "" },
              ])
            }}
            className="flex h-7 items-center gap-2 rounded-lg border p-2 font-medium text-main"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">날짜 추가</span>
          </Button>
          <div className="flex flex-col gap-2 md:gap-4">
            {watch("schedules")?.map((schedule, index) => (
              <div key={index} className="flex items-center md:gap-6">
                <Input
                  {...register(`schedules.${index}.date`)}
                  type="date"
                  className="ml-2 w-[110px] rounded border border-black px-1 md:w-[130px]"
                />
                <span className="hidden text-main md:inline">시간</span>
                <Input
                  {...register(`schedules.${index}.startTime`)}
                  type="time"
                  className="ml-2 w-20 rounded border border-black px-1 md:w-[130px]"
                />
                <p className="mx-2">~</p>

                <Input
                  {...register(`schedules.${index}.endTime`)}
                  type="time"
                  className="w-20 rounded border border-black px-1 md:w-[130px]"
                />
                {index > 0 && (
                  <Button
                    onClick={() => {
                      const newSchedules = [...watch("schedules")]
                      newSchedules.splice(index, 1)
                      setValue("schedules", newSchedules)
                    }}
                    className="ml-1 md:ml-0"
                  >
                    <TrashIcon className="h-6 w-6 rounded border p-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 md:mt-6">
          <Button
            onClick={() => setIsMajorDialog(true)}
            className="flex h-7 items-center gap-2 rounded-lg border p-2 font-medium text-main"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">전공</span>
          </Button>
          {watch("majors").length === 0 ? (
            <p className="text-sm text-grayfont">전공을 선택해주세요.</p>
          ) : (
            watch("majors")?.map(major => (
              <Badge
                key={major.id}
                className="h-8 whitespace-nowrap bg-main text-xs text-white md:text-sm"
              >
                {major.koName}
              </Badge>
            ))
          )}
        </div>
      </div>
      <div className="my-6 h-[300px] md:h-[500px]">
        <CKEditor
          value={watch("contents")}
          onChange={(value: string) => setValue("contents", value)}
        />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => (
            <p className="text-xs font-semibold text-error">{message}</p>
          )}
        />
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
          disabled={isLoading}
          type="submit"
          className="h-9 rounded-3xl bg-main px-6 text-sm text-white"
        >
          {isLoading ? (
            <Spinner className="h-6 w-6" />
          ) : partTime ? (
            "수정"
          ) : (
            "등록"
          )}
        </Button>
      </div>
      <PartTimeMajorDialog
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
          setValue("address", address)
          clearErrors("address")
        }}
      />
    </form>
  )
}
