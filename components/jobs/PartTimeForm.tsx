import React, { useState } from "react"
import { partTimeSchema } from "@/lib/schemas"
import { JOB } from "@/types/jobs"
import { usePathname, useRouter } from "next/navigation"
import useToast from "@/hooks/useToast"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import PlusIcon from "../icons/PlusIcon"
import TrashIcon from "../icons/TrashIcon"

export type PartTimeFormData = yup.InferType<typeof partTimeSchema>

interface PartTimeFormProps {
  isLoading: boolean
  handleSubmitForm: (payload: PartTimeFormData) => void
  partTime?: JOB
}

const initialSchedule = {
  date: "",
  startTime: "",
  endTime: "",
}

export const PartTimeForm = ({
  isLoading,
  handleSubmitForm,
  partTime,
}: PartTimeFormProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { successToast, errorToast } = useToast()
  const [schedules, setSchedules] = useState<
    { date: string; startTime: string; endTime: string }[]
  >([initialSchedule])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      schedules: partTime?.schedules,
    },
  })

  return (
    <form className="mt-8 px-4 md:mt-16">
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
        <div className="mt-2 flex gap-2 md:mt-6">
          <Button
            onClick={() => setSchedules([...schedules, initialSchedule])}
            className="flex h-7 items-center gap-2 rounded-lg border p-2 font-medium text-main"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">날짜 추가</span>
          </Button>
          <div className="flex flex-col gap-2 md:gap-4">
            {schedules.map((schedule, index) => (
              <div key={index} className="flex items-center md:gap-6">
                <Input
                  value={schedule.date}
                  onChange={e => {
                    const newSchedules = [...schedules]
                    newSchedules[index].date = e.target.value
                    setSchedules(newSchedules)
                  }}
                  type="date"
                  className="ml-2 w-[130px] rounded border border-black px-1"
                />
                <span className="text-main">시간</span>
                <Input
                  max={schedule.endTime}
                  value={schedule.startTime}
                  onChange={e => {
                    const newSchedules = [...schedules]
                    newSchedules[index].startTime = e.target.value
                    setSchedules(newSchedules)
                  }}
                  type="time"
                  className="ml-2 w-[130px] rounded border border-black px-1"
                />
                ~
                <Input
                  min={schedule.startTime}
                  value={schedule.endTime}
                  onChange={e => {
                    const newSchedules = [...schedules]
                    newSchedules[index].endTime = e.target.value
                    setSchedules(newSchedules)
                  }}
                  type="time"
                  className="ml-2 w-[130px] rounded border border-black px-1"
                />
                {index > 0 && (
                  <Button
                    onClick={() => {
                      const newSchedules = [...schedules]
                      newSchedules.splice(index, 1)
                      setSchedules(newSchedules)
                    }}
                  >
                    <TrashIcon className="h-6 w-6 rounded border p-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex gap-2 md:mt-6">
          <Button className="flex h-7 items-center gap-2 rounded-lg border p-2 font-medium text-main">
            <PlusIcon className="h-4 w-4" />
            <span className="text-sm">전공</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
