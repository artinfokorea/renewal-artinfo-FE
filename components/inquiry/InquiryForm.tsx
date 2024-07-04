import React from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input, Textarea } from "@headlessui/react"
import { ErrorMessage } from "@hookform/error-message"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import InputField from "../common/InputField"

const schema = yup
  .object({
    title: yup
      .string()
      .min(3, "제목은 3글자이상 입력해주세요.")
      .required("제목은 필수입력사항 입니다."),
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    contents: yup
      .string()
      .min(3, "내용은 10글자이상 입력해주세요.")
      .required("내용은 필수입력사항 입니다."),
  })
  .required()

export type InquiryFormData = yup.InferType<typeof schema>

interface Props {
  handleInquiry: (payload: InquiryFormData) => void
  isLoading: boolean
}

const InquiryForm = ({ handleInquiry, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: yupResolver(schema),
  })

  const router = useRouter()

  return (
    <form className="p-6 md:p-12" onSubmit={handleSubmit(handleInquiry)}>
      <h2 className="text-xl font-bold">문의하기</h2>
      <p className="mt-2 text-sm text-gray-500">
        문의사항이 있으시면 아래 양식을 작성해주세요.
      </p>
      <InputField
        label="제목"
        id="title"
        type="text"
        register={register}
        errors={errors.title}
        placeholder="제목 내용을 입력해주세요"
        className="py-3"
      />
      <InputField
        label="이메일"
        id="email"
        type="email"
        register={register}
        errors={errors.email}
        placeholder="답변받으실 이메일을 입력해주세요."
        className="py-3"
      />
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          문의 내용
        </label>
        <Textarea
          id="contents"
          {...register("contents")}
          placeholder="문의 내용을 입력해주세요."
          className="mt-1 h-[200px] w-full resize-none rounded-md border border-gray-300 p-2 focus:outline-none"
        />
        <ErrorMessage
          errors={errors}
          name="contents"
          render={({ message }) => (
            <p className="font-semibold text-error">{message}</p>
          )}
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
          등록
        </Button>
      </div>
    </form>
  )
}

export default InquiryForm
