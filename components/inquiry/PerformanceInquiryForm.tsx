import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Textarea } from "@headlessui/react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import InputField from "../common/InputField"
import { Spinner } from "../common/Loading"
import ProvinceDialog from "../dialog/ProvinceDialog"
import { PerformanceInquiryPayload } from "@/interface/inquiries"
import { Label } from "../ui/label"
import { useQuery } from "@tanstack/react-query"
import { queries } from "@/lib/queries"

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "")
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "이름은 2글자 이상 입력해주세요.")
      .required("이름은 필수입력사항 입니다."),
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    phone: yup
      .string()
      .matches(
        /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
        "연락처를 정확히 입력해주세요.",
      )
      .required("연락처는 필수입력사항 입니다."),
    ensembleType: yup
      .string()
      .min(2, "편성은 2글자 이상 입력해주세요.")
      .required("편성은 필수입력사항 입니다."),
    contents: yup.string().optional(),
  })
  .required()

type FormData = yup.InferType<typeof schema>

interface Props {
  handleInquiry: (payload: PerformanceInquiryPayload) => void
  isLoading: boolean
}

const PerformanceInquiryForm = ({ handleInquiry, isLoading }: Props) => {
  const [isProvinceDialogOpen, setIsProvinceDialogOpen] = useState(false)
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<number[]>([])

  const { data: provinceData } = useQuery(queries.provinces.list())

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const router = useRouter()
  const phoneValue = watch("phone")

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue("phone", formatted)
  }

  const selectedProvinceNames = provinceData?.provinces
    ?.filter(p => selectedProvinceIds.includes(p.id))
    .map(p => p.name)
    .join(", ")

  const onSubmit = (data: FormData) => {
    handleInquiry({
      ...data,
      contents: data.contents || "",
      provinceIds: selectedProvinceIds,
    })
  }

  return (
    <>
      <form className="p-6 md:p-12" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">기획 문의</h2>
        <p className="mt-2 text-sm text-gray-500">
          공연 기획 문의가 있으시면 아래 양식을 작성해주세요.
        </p>
        <InputField
          label="이름"
          id="name"
          type="text"
          register={register}
          errors={errors.name}
          placeholder="이름을 입력해주세요"
          className="py-3"
        />
        <InputField
          label="이메일"
          id="email"
          type="email"
          register={register}
          errors={errors.email}
          placeholder="답변받으실 이메일을 입력해주세요"
          className="py-3"
        />
        <div className="my-2 flex flex-col gap-2">
          <Label
            htmlFor="phone"
            className="text-tertiary block pb-1 text-sm font-semibold"
          >
            연락처
          </Label>
          <div>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phoneValue || ""}
              onChange={handlePhoneChange}
              placeholder="01012345678"
              maxLength={13}
              className="w-full rounded border px-2 py-3 text-xs leading-tight text-black"
            />
            {errors.phone && (
              <p className="mt-1 pl-2 text-xs text-error">{errors.phone.message}</p>
            )}
          </div>
        </div>
        <InputField
          label="편성"
          id="ensembleType"
          type="text"
          register={register}
          errors={errors.ensembleType}
          placeholder="예: 피아노 솔로, 현악 4중주"
          className="py-3"
        />
        <div className="my-2 flex flex-col gap-2">
          <label className="text-tertiary block pb-1 text-sm font-semibold">
            지역선택 <span className="text-gray-400 font-normal">(선택사항)</span>
          </label>
          <Button
            type="button"
            onClick={() => setIsProvinceDialogOpen(true)}
            className="w-full rounded border px-2 py-3 text-left text-xs"
          >
            {selectedProvinceIds.length > 0
              ? selectedProvinceNames
              : "지역을 선택해주세요 (복수 선택 가능)"}
          </Button>
        </div>
        <div className="mt-4">
          <label
            htmlFor="contents"
            className="block text-sm font-medium text-gray-700"
          >
            문의 내용 <span className="text-gray-400 font-normal">(선택사항)</span>
          </label>
          <Textarea
            id="contents"
            {...register("contents")}
            placeholder="공연 기획 관련 문의 내용을 입력해주세요."
            className="mt-1 h-[200px] w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none"
          />
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <Button
            onClick={() => router.push("/")}
            type="button"
            className="w-20 rounded-full border font-semibold"
          >
            취소
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-20 rounded-full bg-main font-semibold text-white"
          >
            {isLoading ? <Spinner className="h-6 w-6" /> : "등록"}
          </Button>
        </div>
      </form>
      <ProvinceDialog
        provinces={provinceData?.provinces}
        open={isProvinceDialogOpen}
        close={() => setIsProvinceDialogOpen(false)}
        multiple={true}
        selectedProvinceIds={selectedProvinceIds}
        onSelectComplete={setSelectedProvinceIds}
      />
    </>
  )
}

export default PerformanceInquiryForm
