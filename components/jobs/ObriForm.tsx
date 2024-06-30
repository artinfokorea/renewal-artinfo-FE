import React, { useEffect, useState } from "react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import MajorDialog from "../dialog/MajorDialog"
import PostCodeDialog from "../dialog/PostCodeDialog"
import { Input, Textarea } from "@headlessui/react"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"
import { MAJOR } from "@/types/majors"

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, "3자 이상 20자 이하로 입력해주세요.")
      .max(20, "3자 이상 20자 이하로 입력해주세요.")
      .required("제목을 입력해주세요."),
    contents: yup.string().required("부가 정보를 입력해주세요."),
    companyName: yup
      .string()
      .min(2, "2자 이상 20자 이하로 입력해주세요.")
      .max(20, "2자 이상 20자 이하로 입력해주세요.")
      .required(),
    address: yup.string().required("지역을 선택해주세요."),
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
    startAt: yup
      .string()
      .test(
        "isAfterCurrentTime",
        "시작 시간은 현재 시간보다 이후여야 합니다.",
        value => dayjs(value).isAfter(dayjs()),
      )
      .required("시작 시간을 선택해주세요."),
    endAt: yup
      .string()
      .test(
        "isAfterStartAt",
        "종료 시간은 시작 시간보다 이후여야 합니다.",
        (value, context) => {
          const { startAt } = context.parent
          return dayjs(value).isAfter(dayjs(startAt))
        },
      )
      .required("종료 시간을 선택해주세요."),
  })
  .required()

export type CreateObriFormData = yup.InferType<typeof schema>

interface Props {
  isLoading: boolean
  handlePartTimeJob: (payload: CreateObriFormData) => void
}

const ObriForm = ({ isLoading, handlePartTimeJob }: Props) => {
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
  } = useForm<CreateObriFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      majors: [],
      startAt: dayjs().format(),
      endAt: dayjs().format(),
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
      onSubmit={handleSubmit(handlePartTimeJob)}
      className="max-w-screen-lg mx-auto py-8 px-2 font-semibold text-sm"
    >
      <h2 className="md:text-2xl my-4 md:my-12 font-bold">오브리 등록</h2>
      <div className="bg-whitesmoke p-2 md:p-8 rounded-lg flex flex-col gap-2 md:gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex md:basis-1/2 gap-4">
            <Button
              type="button"
              onClick={() => setIsMajorDialog(!isMajorDialog)}
              className="text-main border border-lightgray h-8 w-[100px]"
            >
              전공선택
            </Button>
            <div className="flex flex-col justify-center">
              <span>{watch("majors").map(major => major.koName)}</span>
              <ErrorMessage
                errors={errors}
                name="majors"
                render={({ message }) => (
                  <p className="text-sm text-error font-semibold">{message}</p>
                )}
              />
            </div>
          </div>

          <div className="flex md:basis-1/2 gap-4 items-center">
            <div className="border border-lightgray w-[100px] py-1 text-center rounded-md font-bold">
              단체명
            </div>
            <div className="flex basis-4/5 flex-col ">
              <Input
                {...register("companyName")}
                className=" border-b-2 bg-whitesmoke border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
                placeholder="단체명을 입력해주세요."
              />
              <ErrorMessage
                errors={errors}
                name="companyName"
                render={({ message }) => (
                  <p className="text-sm text-error font-semibold">{message}</p>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:items-center md:gap-8">
          <div className="flex items-center gap-4 md:basis-2/3">
            <div className="border border-lightgray w-[100px] py-1 text-center rounded-md font-bold">
              행사명
            </div>
            <div className="flex basis-4/5 flex-col ">
              <Input
                {...register("title")}
                className="border-b-2 bg-whitesmoke border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
                placeholder="행사명을 입력해주세요."
              />
              <ErrorMessage
                errors={errors}
                name="title"
                render={({ message }) => (
                  <p className="text-error font-semibold md:basis-1/2">
                    {message}
                  </p>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 md:basis-1/3">
            <div className="border border-lightgray w-[100px] md:w-[60px] py-1 text-center rounded-md font-bold">
              페이
            </div>
            <div
              className={`flex basis-4/5 md:basis-2/5 items-center ${
                errors.fee && "flex-col"
              }`}
            >
              <div className="flex w-full items-center">
                <Input
                  type="number"
                  {...register("fee")}
                  className="border-b-2 bg-whitesmoke border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
                />
                원
              </div>
              <ErrorMessage
                errors={errors}
                name="fee"
                render={({ message }) => (
                  <p className="text-error font-semibold md:basis-1/4">
                    {message}
                  </p>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center md:gap-4">
          <Button
            type="button"
            onClick={() => setIsPostDialog(!isPostDialog)}
            className="text-main border border-lightgray h-8 w-full md:w-[100px] flex-shrink-0"
          >
            주소 검색
          </Button>
          <div className="flex w-full md:basis-2/3 flex-col">
            <Input
              readOnly
              {...register("address")}
              className=" border-b-2 bg-whitesmoke border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
              placeholder="주소 검색을 해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="address"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="flex w-full md:basis-2/6 flex-col">
            <Input
              {...register("detailAddress")}
              placeholder="상세주소를 입력해주세요."
              className="md:basis-2/6 border-b-2 bg-whitesmoke border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
            />
            <ErrorMessage
              errors={errors}
              name="detailAddress"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:basis-1/3">
          <div className="flex md:basis-1/2 items-center gap-4">
            <div className="hidden md:flex justify-center items-center border border-lightgray w-[60px] h-8 py-1 text-center rounded-md font-bold">
              시작
            </div>
            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    label="시작 시간"
                    minDate={dayjs()}
                    value={dayjs(watch("startAt"))}
                    onChange={(newValue: any) => {
                      setValue("startAt", dayjs(newValue.$d).format())
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <ErrorMessage
                errors={errors}
                name="startAt"
                render={({ message }) => (
                  <p className="text-error font-semibold">{message}</p>
                )}
              />
            </div>
          </div>
          <div className="flex md:basis-1/2 items-center gap-4">
            <div className="hidden md:flex justify-center items-center border border-lightgray h-8 w-[60px] py-1 text-center rounded-md font-bold">
              종료
            </div>
            <div className="flex flex-col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    label="종료 시간"
                    minDate={dayjs(watch("startAt"))}
                    value={dayjs(watch("endAt"))}
                    onChange={(newValue: any) => {
                      setValue("endAt", dayjs(newValue.$d).format())
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <ErrorMessage
                errors={errors}
                name="endAt"
                render={({ message }) => (
                  <p className="text-error font-semibold">{message}</p>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex md:items-center gap-2 md:gap-4 flex-col md:flex-row ">
          <div className="border border-lightgray w-[100px] py-1 text-center rounded-md font-bold">
            행사명
          </div>
          <div className="flex flex-col w-full">
            <Textarea
              {...register("contents")}
              className="border rounded-lg resize-none bg-whitesmoke h-20 border-lightgray w-full p-2 focus:outline-none placeholder:text-primary"
              placeholder="부가 정보를 입력해주세요."
            />
            <ErrorMessage
              errors={errors}
              name="contents"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 my-2">
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
        setValue={address => setValue("address", address)}
      />
    </form>
  )
}

export default ObriForm
